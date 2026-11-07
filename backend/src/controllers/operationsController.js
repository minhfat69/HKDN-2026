const {
    User, Product, Order, OrderItem, RestaurantTable, Payment,
    Voucher, Shift, Ingredient, InventoryBatch, Recipe, sequelize
} = require('../models');
const { Op } = require('sequelize');

// Hàm phụ trợ: Tự động trừ kho nguyên vật liệu theo lô sắp hết hạn trước (FEFO) dựa trên Recipe
async function deductIngredientsByOrder(orderId, transaction) {
    const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: 'OrderItems' }],
        transaction
    });
    if (!order || order.isRecipeDeducted) return;

    for (const item of order.OrderItems || []) {
        const recipes = await Recipe.findAll({ where: { product_id: item.product_id }, transaction });
        for (const rec of recipes) {
            let needed = Number(rec.amountRequired) * Number(item.quantity);
            const ingredient = await Ingredient.findByPk(rec.ingredient_id, { transaction });
            if (!ingredient) continue;

            // Lấy các lô còn tồn kho theo thứ tự hạn sử dụng gần nhất (FEFO)
            const batches = await InventoryBatch.findAll({
                where: { ingredient_id: ingredient.id, quantityRemaining: { [Op.gt]: 0 } },
                order: [['expDate', 'ASC']],
                transaction
            });

            for (const b of batches) {
                if (needed <= 0) break;
                const avail = Number(b.quantityRemaining);
                const take = Math.min(avail, needed);
                await b.update({ quantityRemaining: avail - take }, { transaction });
                needed -= take;
            }

            const newTotal = Math.max(0, Number(ingredient.totalQuantity) - (Number(rec.amountRequired) * Number(item.quantity)));
            await ingredient.update({ totalQuantity: newTotal }, { transaction });
        }
    }
    await order.update({ isRecipeDeducted: true }, { transaction });
}
exports.deductIngredientsByOrder = deductIngredientsByOrder;

// 1. KIỂM TRA VOUCHER & ĐẶC QUYỀN HẠNG THÀNH VIÊN (TIERING)
exports.previewDiscount = async (req, res) => {
    try {
        const { subtotal, voucherCode, user_id } = req.body;
        const amount = Number(subtotal || 0);
        let tierDiscount = 0;
        let tierName = 'MEMBER';

        if (user_id) {
            const user = await User.findByPk(user_id);
            if (user) {
                tierName = user.tier || 'MEMBER';
                const tierRates = { MEMBER: 0, SILVER: 0.03, GOLD: 0.05, VIP: 0.10 };
                tierDiscount = Math.round(amount * (tierRates[tierName] || 0));
            }
        }

        let voucherDiscount = 0;
        if (voucherCode) {
            const v = await Voucher.findOne({ where: { code: voucherCode.trim().toUpperCase(), isActive: true } });
            if (!v) return res.status(404).json({ message: 'Mã giảm giá không tồn tại hoặc đã ngừng hoạt động' });
            if (v.expiredAt && new Date(v.expiredAt) < new Date()) return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
            if (v.usedCount >= v.usageLimit) return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
            if (amount < Number(v.minOrderValue)) return res.status(400).json({ message: `Đơn tối thiểu ${Number(v.minOrderValue).toLocaleString('vi-VN')}đ để dùng mã này` });

            if (v.discountType === 'PERCENT') {
                voucherDiscount = Math.round((amount * Number(v.discountValue)) / 100);
                if (v.maxDiscount) voucherDiscount = Math.min(voucherDiscount, Number(v.maxDiscount));
            } else {
                voucherDiscount = Number(v.discountValue);
            }
        }

        const totalDiscount = tierDiscount + voucherDiscount;
        const vatAmount = Math.round(Math.max(0, amount - totalDiscount) * 0.08);
        const finalPrice = Math.max(0, amount - totalDiscount + vatAmount);

        res.json({ subtotal: amount, tierName, tierDiscount, voucherDiscount, totalDiscount, vatAmount, finalPrice });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllVouchers = async (req, res) => {
    const list = await Voucher.findAll({ order: [['id', 'DESC']] });
    res.json(list);
};

exports.createVoucher = async (req, res) => {
    try {
        const payload = { ...req.body, code: String(req.body.code || '').trim().toUpperCase() };
        const created = await Voucher.create(payload);
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 2. ĐẶT HÀNG WEB DELIVERY (THANH TOÁN TRƯỚC 100% CHỐNG BOM HÀNG)
exports.createDeliveryOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, deliveryAddress, recipientPhone, voucherCode, note, paymentMethod = 'PAYOS' } = req.body;
        const user_id = req.user ? req.user.id : req.body.user_id;

        if (!deliveryAddress || !recipientPhone) {
            await t.rollback();
            return res.status(400).json({ message: 'Đơn giao hàng bắt buộc phải có địa chỉ và SĐT người nhận' });
        }
        if (!items || !items.length) {
            await t.rollback();
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }

        let totalPrice = 0;
        const orderItemsData = [];
        for (const item of items) {
            const product = await Product.findByPk(item.product_id, { transaction: t });
            if (!product || !product.isAvailable || product.stock < item.quantity) {
                throw new Error(`Món ${product ? product.name : item.product_id} không đủ số lượng phục vụ`);
            }
            const itemTotal = Number(product.price) * item.quantity;
            totalPrice += itemTotal;
            orderItemsData.push({
                product_id: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice: itemTotal,
                note: item.note || ''
            });
            await product.update({ stock: product.stock - item.quantity }, { transaction: t });
        }

        const vatAmount = Math.round(totalPrice * 0.08);
        const finalPrice = totalPrice + vatAmount;

        const order = await Order.create({
            orderType: 'DELIVERY',
            user_id: user_id || null,
            table_id: null,
            deliveryAddress,
            recipientPhone,
            voucherCode: voucherCode || null,
            totalPrice,
            discountAmount: 0,
            vatAmount,
            finalPrice,
            note: `[WEB-DELIVERY] Đ/c: ${deliveryAddress} - SĐT: ${recipientPhone}. ${note || ''}`,
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            paymentMethod: paymentMethod
        }, { transaction: t });

        await OrderItem.bulkCreate(orderItemsData.map(i => ({ ...i, order_id: order.id })), { transaction: t });

        await Payment.create({
            order_id: order.id,
            amount: finalPrice,
            paymentMethod: paymentMethod,
            transactionCode: `DELIVERY-PREPAID-${order.id}-${Date.now()}`,
            status: 'SUCCESS',
            paidAt: new Date()
        }, { transaction: t });

        await deductIngredientsByOrder(order.id, t);
        await t.commit();
        res.status(201).json({ message: 'Đặt đơn Giao hàng & Thanh toán trực tuyến 100% thành công!', data: order });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ message: err.message });
    }
};

// 3. THU NGÂN: HỦY MÓN / HAO HỤT (VOID / WASTE CẦN PIN QUẢN LÝ) & QUẢN LÝ CA
exports.voidOrWasteOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { managerPin, reason, isWaste } = req.body;
        const validPin = process.env.MANAGER_PIN || '123456';

        if (String(managerPin) !== String(validPin)) {
            await t.rollback();
            return res.status(403).json({ message: 'Mã PIN Quản lý không chính xác! Từ chối hủy món/hao hụt.' });
        }

        const order = await Order.findByPk(id, { include: [{ model: OrderItem, as: 'OrderItems' }], transaction: t });
        if (!order) {
            await t.rollback();
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        if (!isWaste) {
            for (const item of order.OrderItems || []) {
                const product = await Product.findByPk(item.product_id, { transaction: t });
                if (product) {
                    await product.update({ stock: (product.stock || 0) + item.quantity, isAvailable: true }, { transaction: t });
                }
            }
        } else {
            // Nếu là Waste (Bếp làm hỏng), tự động trừ kho nguyên liệu để tính vào chi phí hao hụt P&L
            await deductIngredientsByOrder(order.id, t);
        }

        await order.update({
            status: 'CANCELLED',
            cancelReason: reason || (isWaste ? 'Bếp làm hỏng (Waste)' : 'Khách trả món (Void)'),
            isWaste: !!isWaste
        }, { transaction: t });

        await t.commit();
        res.json({ message: `Đã duyệt hủy đơn #${order.id} bằng mã PIN Quản lý (${isWaste ? 'Hao hụt Bếp' : 'Hoàn kho'})`, data: order });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ message: err.message });
    }
};

exports.openShift = async (req, res) => {
    try {
        const { openingCash, note } = req.body;
        const existing = await Shift.findOne({ where: { status: 'OPEN' } });
        if (existing) return res.status(400).json({ message: 'Đang có ca làm việc mở, vui lòng đóng ca trước khi mở ca mới' });

        const shift = await Shift.create({
            staff_id: req.user ? req.user.id : null,
            openingCash: Number(openingCash || 0),
            note: note || 'Mở ca đầu ngày'
        });
        res.status(201).json({ message: 'Đã mở ca làm việc thành công', data: shift });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.closeShift = async (req, res) => {
    try {
        const { closingCashActual, note } = req.body;
        const shift = await Shift.findOne({ where: { status: 'OPEN' }, order: [['id', 'DESC']] });
        if (!shift) return res.status(404).json({ message: 'Không có ca làm việc nào đang mở' });

        const cashPayments = await Payment.findAll({
            where: {
                paymentMethod: 'CASH',
                status: 'SUCCESS',
                paidAt: { [Op.gte]: shift.openedAt }
            }
        });
        const cashRevenue = cashPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const expectedCash = Number(shift.openingCash) + cashRevenue;
        const actual = Number(closingCashActual || 0);
        const discrepancy = actual - expectedCash;

        await shift.update({
            closingCashActual: actual,
            expectedCash,
            discrepancy,
            status: 'CLOSED',
            closedAt: new Date(),
            note: note || shift.note
        });

        res.json({
            message: 'Đã đóng ca và đối soát tiền mặt thành công',
            data: { shift, cashRevenue, expectedCash, actual, discrepancy }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCurrentShift = async (req, res) => {
    const shift = await Shift.findOne({ order: [['id', 'DESC']] });
    res.json(shift || null);
};

// 4. ADMIN: QUẢN LÝ KHO BARCODE, LÔ HÀNG MFG/EXP (FEFO), ĐỊNH LƯỢNG RECIPE & BÁO CÁO P&L
exports.getInventory = async (req, res) => {
    const ingredients = await Ingredient.findAll({
        include: [{ model: InventoryBatch, as: 'batches' }],
        order: [['id', 'ASC']]
    });
    const formatted = ingredients.map(ing => {
        const plain = ing.get({ plain: true });
        plain.batches = (plain.batches || []).sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
        plain.fefoSuggestion = plain.batches.find(b => Number(b.quantityRemaining) > 0) || null;
        return plain;
    });
    res.json(formatted);
};

exports.importStockByBarcode = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { barcode, name, unit, quantity, unitCost, mfgDate, expDate } = req.body;
        if (!barcode || !quantity) {
            await t.rollback();
            return res.status(400).json({ message: 'Vui lòng quét mã Barcode và nhập số lượng' });
        }
        let ingredient = await Ingredient.findOne({ where: { barcode: barcode.trim() }, transaction: t });
        if (!ingredient) {
            ingredient = await Ingredient.create({
                barcode: barcode.trim(),
                name: name || `Nguyên liệu ${barcode}`,
                unit: unit || 'gram',
                totalQuantity: 0,
                costPerUnit: Number(unitCost || 0)
            }, { transaction: t });
        }

        const batch = await InventoryBatch.create({
            ingredient_id: ingredient.id,
            batchCode: `LOT-${barcode.trim()}-${Date.now().toString().slice(-4)}`,
            quantityImported: Number(quantity),
            quantityRemaining: Number(quantity),
            unitCost: Number(unitCost || ingredient.costPerUnit || 0),
            mfgDate: mfgDate || new Date().toISOString().slice(0, 10),
            expDate: expDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
        }, { transaction: t });

        await ingredient.update({
            totalQuantity: Number(ingredient.totalQuantity) + Number(quantity),
            costPerUnit: Number(unitCost || ingredient.costPerUnit)
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Nhập kho bằng mã Barcode thành công', data: { ingredient, batch } });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ message: err.message });
    }
};

exports.getRecipes = async (req, res) => {
    const list = await Recipe.findAll({
        include: [
            { model: Product, as: 'product', attributes: ['id', 'name'] },
            { model: Ingredient, as: 'ingredient', attributes: ['id', 'name', 'unit', 'barcode'] }
        ]
    });
    res.json(list);
};

exports.saveRecipe = async (req, res) => {
    try {
        const { product_id, ingredient_id, amountRequired } = req.body;
        const [rec, created] = await Recipe.findOrCreate({
            where: { product_id, ingredient_id },
            defaults: { amountRequired: Number(amountRequired) }
        });
        if (!created) await rec.update({ amountRequired: Number(amountRequired) });
        res.json({ message: 'Đã lưu công thức định lượng (Recipe)', data: rec });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getPnLAndForecast = async (req, res) => {
    try {
        const completedOrders = await Order.findAll({
            where: { status: 'COMPLETED', paymentStatus: 'PAID' },
            include: [{ model: OrderItem, as: 'OrderItems', include: [{ model: Product, as: 'Product' }] }]
        });

        let totalRevenue = 0;
        let totalDiscount = 0;
        let totalCOGS = 0;
        const dishSales = {};

        for (const o of completedOrders) {
            totalRevenue += Number(o.finalPrice || 0);
            totalDiscount += Number(o.discountAmount || 0);
            for (const item of o.OrderItems || []) {
                const qty = Number(item.quantity || 0);
                const unitCost = Number(item.Product?.costPrice || (Number(item.unitPrice) * 0.38));
                totalCOGS += qty * unitCost;

                const pName = item.Product?.name || `Món #${item.product_id}`;
                if (!dishSales[pName]) dishSales[pName] = { name: pName, soldQty: 0, revenue: 0 };
                dishSales[pName].soldQty += qty;
                dishSales[pName].revenue += Number(item.totalPrice || 0);
            }
        }

        const voidWasteOrders = await Order.findAll({ where: { status: 'CANCELLED', isWaste: true } });
        const wasteCost = voidWasteOrders.reduce((s, o) => s + Number(o.totalPrice || 0) * 0.4, 0);

        const grossProfit = totalRevenue - totalCOGS - wasteCost;
        const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

        const topDishesForecast = Object.values(dishSales)
            .sort((a, b) => b.soldQty - a.soldQty)
            .slice(0, 5)
            .map(d => ({
                ...d,
                forecastTomorrowQty: Math.ceil(d.soldQty * 1.15),
                prepRecommendation: `Chuẩn bị nguyên liệu tối thiểu ${Math.ceil(d.soldQty * 1.15)} suất`
            }));

        res.json({
            totalRevenue,
            totalDiscount,
            totalCOGS: Math.round(totalCOGS),
            wasteCost: Math.round(wasteCost),
            grossProfit: Math.round(grossProfit),
            profitMargin: Number(profitMargin),
            topDishesForecast
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
