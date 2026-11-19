const { Order, OrderItem, Product, RestaurantTable, User, Reservation, Payment, Voucher, sequelize } = require('../models');
const { deductIngredientsByOrder } = require('./operationsController');

async function awardLoyaltyPointsForOrder(order, t) {
    if (!order || !order.user_id || order.isPointsAdded || typeof User?.findByPk !== 'function') return null;
    const user = await User.findByPk(order.user_id, { transaction: t });
    if (!user || typeof user.update !== 'function') return null;

    const paidAmount = Number(order.finalPrice || order.totalPrice || 0);
    // Tích điểm: 5% giá trị đơn (hoặc tối thiểu 10 điểm nếu đơn > 0)
    const earnedPoints = paidAmount > 0 ? Math.max(10, Math.round(paidAmount * 0.05)) : 0;
    const nextPoints = Number(user.points || 0) + earnedPoints;
    const nextSpent = Number(user.totalSpent || 0) + paidAmount;

    let nextTier = user.tier || 'MEMBER';
    let nextMembershipTier = user.membershipTier || 'BAC';
    if (nextSpent >= 5000000 || nextPoints >= 500000) {
        nextTier = 'VIP';
        nextMembershipTier = 'VIP';
    } else if (nextSpent >= 2000000 || nextPoints >= 200000) {
        nextTier = 'GOLD';
        nextMembershipTier = 'VANG';
    } else if (nextSpent >= 500000 || nextPoints >= 50000) {
        nextTier = 'SILVER';
        nextMembershipTier = 'BAC';
    }

    await user.update({
        points: nextPoints,
        totalSpent: nextSpent,
        tier: nextTier,
        membershipTier: nextMembershipTier
    }, { transaction: t });

    if (typeof order.update === 'function') {
        await order.update({ isPointsAdded: true }, { transaction: t });
    }
    return { earnedPoints, totalPoints: nextPoints, tier: nextTier };
}

exports.createOrder = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { table_id, items, note, used_points, voucherCode, customerPhone, customerType } = req.body;
        // Xác định user_id: hỗ trợ chọn Khách vãng lai (GUEST) hoặc Thành viên (qua user_id, SĐT, hoặc Token khách hàng)
        let user_id = null;
        if (String(customerType || '').toUpperCase() === 'GUEST') {
            user_id = null;
        } else if (req.body.user_id) {
            user_id = Number(req.body.user_id) || null;
        } else if (customerPhone && typeof User?.findOne === 'function') {
            const memberByPhone = await User.findOne({ where: { phone: String(customerPhone).trim() }, transaction: t });
            if (!memberByPhone) {
                throw new Error(`Không tìm thấy tài khoản thành viên với SĐT "${customerPhone}"!`);
            }
            user_id = memberByPhone.id;
        } else if (req.user && !['ADMIN', 'STAFF', 'HOST', 'KITCHEN'].includes(String(req.user.role || '').toUpperCase())) {
            user_id = req.user.id;
        }

        console.log(">>> Create Order Request:", { table_id, user_id, used_points, voucherCode });

        if (!items || !items.length) {
            return res.status(400).json({ message: "Đơn hàng phải có ít nhất một món ăn" });
        }

        let totalPrice = 0;
        const orderItemsData = [];

        // 1. Kiểm tra tồn kho và trạng thái phục vụ từng món
        for (const item of items) {
            const product = await Product.findByPk(item.product_id, { transaction: t });
            if (!product) {
                throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);
            }

            if (product.isAvailable === false) {
                throw new Error(`Món "${product.name}" hiện đang tạm ngưng phục vụ!`);
            }

            if (product.stock !== undefined && product.stock !== null) {
                if (product.stock < item.quantity) {
                    throw new Error(`Món "${product.name}" chỉ còn ${product.stock} suất trong kho, không đủ phục vụ (${item.quantity} suất)!`);
                }
            }

            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;

            orderItemsData.push({
                product,
                product_id: item.product_id,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice: itemTotal,
                note: item.note || ""
            });
        }

        // 2. Trừ số lượng tồn kho của món ăn & cập nhật trạng thái nếu hết hàng
        for (const orderItem of orderItemsData) {
            const product = orderItem.product;
            if (product.stock !== undefined && product.stock !== null) {
                const newStock = Math.max(0, product.stock - orderItem.quantity);
                const updateFields = { stock: newStock };
                if (newStock === 0) {
                    updateFields.isAvailable = false; // Tự động ngưng phục vụ nếu hết hàng trong kho
                }
                await product.update(updateFields, { transaction: t });
                console.log(`>>> Deducted ${orderItem.quantity} from product #${product.id} (${product.name}). New stock: ${newStock}`);
            }
        }

        // Xử lý điểm thưởng (1 điểm = 1đ) + Voucher giảm giá + Chiết khấu hạng thành viên
        let discountAmount = 0;
        const pointsToUse = parseInt(used_points) || 0;
        let appliedVoucherId = null;
        let appliedVoucherCode = null;

        if (user_id && pointsToUse > 0) {
            const user = await User.findByPk(user_id, { transaction: t });
            console.log(">>> Found User for points:", user ? { id: user.id, points: user.points } : "Not Found");

            if (user && user.points >= pointsToUse) {
                discountAmount += pointsToUse;
                // Trừ điểm của người dùng
                const newPoints = user.points - pointsToUse;
                await user.update({ points: newPoints }, { transaction: t });
                console.log(`>>> Deducted ${pointsToUse} points. New points: ${newPoints}`);
            } else if (user && user.points < pointsToUse) {
                throw new Error(`Số điểm tích lũy (${user.points}) không đủ để áp dụng (${pointsToUse})`);
            }
        } else if (user_id && pointsToUse === 0 && voucherCode && typeof User?.findByPk === 'function') {
            // Khi khách thành viên áp mã hoặc gọi món có chọn thành viên, tính thêm ưu đãi hạng thẻ nếu có
            const memberUser = await User.findByPk(user_id, { transaction: t });
            if (memberUser && memberUser.tier) {
                const tierRates = { MEMBER: 0, SILVER: 0.03, GOLD: 0.05, VIP: 0.10 };
                const tierDisc = Math.round(totalPrice * (tierRates[memberUser.tier] || 0));
                discountAmount += tierDisc;
            }
        }

        if (voucherCode && typeof Voucher?.findOne === 'function') {
            const cleanCode = String(voucherCode).trim().toUpperCase();
            const voucher = await Voucher.findOne({ where: { code: cleanCode, isActive: true }, transaction: t });
            if (!voucher) {
                throw new Error(`Mã giảm giá "${cleanCode}" không tồn tại hoặc đã ngừng hoạt động!`);
            }
            if (voucher.expiredAt && new Date(voucher.expiredAt) < new Date()) {
                throw new Error(`Mã giảm giá "${cleanCode}" đã hết hạn sử dụng!`);
            }
            if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
                throw new Error(`Mã giảm giá "${cleanCode}" đã hết lượt sử dụng!`);
            }
            if (totalPrice < Number(voucher.minOrderValue || 0)) {
                throw new Error(`Đơn hàng cần tối thiểu ${Number(voucher.minOrderValue).toLocaleString('vi-VN')}đ để áp dụng mã "${cleanCode}"!`);
            }

            let vDisc = 0;
            if (voucher.discountType === 'PERCENT') {
                vDisc = Math.round((totalPrice * Number(voucher.discountValue)) / 100);
                if (voucher.maxDiscount) vDisc = Math.min(vDisc, Number(voucher.maxDiscount));
            } else {
                vDisc = Number(voucher.discountValue || 0);
            }
            discountAmount += vDisc;
            appliedVoucherId = voucher.id;
            appliedVoucherCode = voucher.code;
            if (typeof voucher.update === 'function') {
                await voucher.update({ usedCount: Number(voucher.usedCount || 0) + 1 }, { transaction: t });
            }
        }

        const finalPrice = Math.max(0, totalPrice - discountAmount);
        console.log(">>> Pricing calculation:", { totalPrice, discountAmount, finalPrice });

        const orderPayload = {
            table_id,
            user_id: user_id || null,
            totalPrice,
            discountAmount,
            finalPrice,
            note,
            status: 'PENDING',
            paymentStatus: 'UNPAID'
        };
        if (appliedVoucherId) orderPayload.voucher_id = appliedVoucherId;
        if (appliedVoucherCode) orderPayload.voucherCode = appliedVoucherCode;
        if (pointsToUse > 0) orderPayload.pointsUsed = pointsToUse;

        const order = await Order.create(orderPayload, { transaction: t });

        const itemsWithOrderId = orderItemsData.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            note: item.note,
            order_id: order.id
        }));
        await OrderItem.bulkCreate(itemsWithOrderId, { transaction: t });

        if (table_id) {
            await RestaurantTable.update(
                { status: 'OCCUPIED' },
                { where: { id: table_id }, transaction: t }
            );
        }

        await t.commit();

        const createdOrder = await Order.findByPk(order.id, {
            include: [
                { model: OrderItem, as: 'OrderItems', include: [{ model: Product, as: 'Product' }] }
            ]
        });

        res.status(201).json({
            message: "Đặt món thành công",
            data: createdOrder
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Create Order Error:", error);
        res.status(400).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const { status, paymentStatus } = req.query;
        const whereClause = {};
        if (status) whereClause.status = status;
        if (paymentStatus) whereClause.paymentStatus = paymentStatus;

        const orders = await Order.findAll({
            where: whereClause,
            include: [
                { model: RestaurantTable, as: 'RestaurantTable' },
                { model: User, as: 'User', attributes: ['id', 'fullName', 'phone', 'points', 'tier'] },
                {
                    model: OrderItem,
                    as: 'OrderItems',
                    include: [{ model: Product, as: 'Product' }]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error("Get All Orders Error:", error);
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id, {
            include: [
                { model: RestaurantTable, as: 'RestaurantTable' },
                { model: User, as: 'User', attributes: ['id', 'fullName', 'phone', 'points', 'tier'] },
                {
                    model: OrderItem,
                    as: 'OrderItems',
                    include: [{ model: Product, as: 'Product' }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        res.json(order);
    } catch (error) {
        console.error("Get Order By Id Error:", error);
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(id, {
            include: [{ model: OrderItem, as: 'OrderItems' }],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        const oldStatus = String(order.status).toUpperCase();
        const newStatus = String(status).toUpperCase();

        // Nếu chuyển sang CANCELLED và trước đó chưa CANCELLED -> Hoàn lại số lượng tồn kho
        if (newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED') {
            for (const item of order.OrderItems || []) {
                const product = await Product.findByPk(item.product_id, { transaction: t });
                if (product) {
                    const restoredStock = (product.stock || 0) + item.quantity;
                    await product.update({
                        stock: restoredStock,
                        isAvailable: true // Mở lại món ăn nếu hoàn lại kho
                    }, { transaction: t });
                    console.log(`>>> Restored ${item.quantity} to product #${product.id} (${product.name}). New stock: ${restoredStock}`);
                }
            }
        }

        if (['READY', 'COMPLETED'].includes(newStatus)) {
            await deductIngredientsByOrder(order.id, t);
        }

        await order.update({ status: newStatus }, { transaction: t });
        await t.commit();

        res.json({ message: "Cập nhật trạng thái thành công", data: order });
    } catch (error) {
        if (t) await t.rollback();
        console.error("Update Order Status Error:", error);
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id, {
            include: [{ model: OrderItem, as: 'OrderItems' }],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        // Hoàn trả tồn kho nếu đơn hủy/xóa chưa bị CANCELLED trước đó
        if (String(order.status).toUpperCase() !== 'CANCELLED') {
            for (const item of order.OrderItems || []) {
                const product = await Product.findByPk(item.product_id, { transaction: t });
                if (product) {
                    const restoredStock = (product.stock || 0) + item.quantity;
                    await product.update({
                        stock: restoredStock,
                        isAvailable: true
                    }, { transaction: t });
                }
            }
        }

        await order.destroy({ transaction: t });
        await t.commit();
        res.json({ message: "Xóa đơn hàng thành công" });
    } catch (error) {
        if (t) await t.rollback();
        console.error("Delete Order Error:", error);
        next(error);
    }
};

exports.getCurrentOrderByTable = async (req, res, next) => {
    try {
        const { tableId } = req.params;

        const orders = await Order.findAll({
            where: {
                table_id: tableId,
                paymentStatus: 'UNPAID',
                status: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY']
            },
            include: [
                {
                    model: OrderItem,
                    as: 'OrderItems',
                    include: [{ model: Product, as: 'Product' }]
                }
            ]
        });

        if (!orders || orders.length === 0) {
            return res.json([]); // Trả về mảng rỗng thay vì 404 để tránh lỗi parsing trên Mobile
        }

        res.json(orders);
    } catch (error) {
        console.error("Get Current Order By Table Error:", error);
        next(error);
    }
};

exports.payAllOrdersByTable = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { tableId } = req.params;
        const { paymentMethod } = req.body;

        const orders = await Order.findAll({
            where: {
                table_id: tableId,
                paymentStatus: 'UNPAID'
            }
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng cần thanh toán" });
        }

        // Kiểm tra trạng thái đơn hàng: Chỉ cho phép thanh toán nếu đơn hàng đã READY hoặc các trạng thái hợp lệ
        const invalidOrders = orders.filter(o => !['READY', 'COMPLETED'].includes(o.status));
        if (invalidOrders.length > 0) {
            return res.status(400).json({
                message: "Không thể thanh toán. Có đơn hàng chưa hoàn thành chế biến.",
                invalidOrderIds: invalidOrders.map(o => o.id)
            });
        }

        const orderIds = orders.map(o => o.id);

        await Order.update({
            paymentStatus: 'PAID',
            status: 'COMPLETED',
            paymentMethod: paymentMethod || 'CASH'
        }, {
            where: { id: orderIds },
            transaction: t
        });

        // Lưu thông tin thanh toán vào bảng payments
        for (const o of orders) {
            const txnCode = `PAY-TBL${tableId}-${o.id}-${Date.now()}`;
            const [pRecord, created] = await Payment.findOrCreate({
                where: { order_id: o.id },
                defaults: {
                    order_id: o.id,
                    amount: o.finalPrice,
                    paymentMethod: paymentMethod || 'CASH',
                    transactionCode: txnCode,
                    status: 'SUCCESS',
                    paidAt: new Date()
                },
                transaction: t
            });
            if (!created) {
                await pRecord.update({
                    amount: o.finalPrice,
                    paymentMethod: paymentMethod || 'CASH',
                    status: 'SUCCESS',
                    paidAt: new Date()
                }, { transaction: t });
            }
            await awardLoyaltyPointsForOrder(o, t);
        }

        await RestaurantTable.update(
            { status: 'AVAILABLE' },
            { where: { id: tableId }, transaction: t }
        );

        // Tự động hoàn thành lịch đặt bàn liên quan nếu có
        await Reservation.update(
            { status: 'COMPLETED' },
            {
                where: {
                    table_id: tableId,
                    status: 'CHECKED_IN'
                },
                transaction: t
            }
        );

        await t.commit();
        res.json({ message: `Đã thanh toán thành công ${orders.length} đơn hàng.` });
    } catch (error) {
        if (t) await t.rollback();
        console.error("Pay All Orders Error:", error);
        next(error);
    }
};

exports.payOrder = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { paymentMethod } = req.body;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.paymentStatus === 'PAID') {
            return res.status(400).json({ message: "Đơn hàng này đã được thanh toán trước đó" });
        }

        if (!['READY', 'COMPLETED'].includes(order.status)) {
            return res.status(400).json({ message: "Đơn hàng phải ở trạng thái 'Chờ phục vụ' mới có thể thanh toán" });
        }

        await order.update({
            paymentStatus: 'PAID',
            status: 'COMPLETED',
            paymentMethod: paymentMethod || 'CASH'
        }, { transaction: t });

        // Lưu thông tin thanh toán vào bảng payments
        const txnCode = `PAY-${order.id}-${Date.now()}`;
        const [pRecord, created] = await Payment.findOrCreate({
            where: { order_id: order.id },
            defaults: {
                order_id: order.id,
                amount: order.finalPrice,
                paymentMethod: paymentMethod || 'CASH',
                transactionCode: txnCode,
                status: 'SUCCESS',
                paidAt: new Date()
            },
            transaction: t
        });
        if (!created) {
            await pRecord.update({
                amount: order.finalPrice,
                paymentMethod: paymentMethod || 'CASH',
                status: 'SUCCESS',
                paidAt: new Date()
            }, { transaction: t });
        }

        await awardLoyaltyPointsForOrder(order, t);

        if (order.table_id) {
            await RestaurantTable.update(
                { status: 'AVAILABLE' },
                { where: { id: order.table_id }, transaction: t }
            );

            // Tự động hoàn thành lịch đặt bàn liên quan nếu có
            await Reservation.update(
                { status: 'COMPLETED' },
                {
                    where: {
                        table_id: order.table_id,
                        status: 'CHECKED_IN'
                    },
                    transaction: t
                }
            );
        }

        await t.commit();
        res.json({ message: "Thanh toán thành công. Bàn hiện đã sẵn sàng." });
    } catch (error) {
        if (t) await t.rollback();
        console.error("Pay Order Error:", error);
        next(error);
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await Order.findAll({
            where: { user_id: userId },
            include: [
                { model: RestaurantTable, as: 'RestaurantTable' },
                {
                    model: OrderItem,
                    as: 'OrderItems',
                    include: [{ model: Product, as: 'Product' }]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error("Get My Orders Error:", error);
        next(error);
    }
};
