const { Op } = require('sequelize');
const { Waitlist, RestaurantTable, sequelize } = require('../models');

const MINUTES_PER_GROUP = 10; // ước lượng thời gian chờ cho mỗi nhóm đứng trước
const ACTIVE = ['WAITING', 'NOTIFIED'];

// Bàn trống phù hợp nhất (đủ chỗ, nhỏ nhất trước)
async function findSuggestedTable(partySize) {
    return RestaurantTable.findOne({
        where: { status: 'AVAILABLE', capacity: { [Op.gte]: partySize } },
        order: [['capacity', 'ASC'], ['tableNumber', 'ASC']],
    });
}

async function estimateWait(partySize) {
    const ahead = await Waitlist.count({ where: { status: ACTIVE } });
    const free = await findSuggestedTable(partySize);
    if (free && ahead === 0) return 0;
    return Math.max(5, (ahead + 1) * MINUTES_PER_GROUP);
}

exports.createEntry = async (req, res) => {
    try {
        const guestName = String(req.body.guestName || '').trim();
        const guestPhone = String(req.body.guestPhone || '').trim();
        const partySize = parseInt(req.body.partySize);
        if (!guestName || !guestPhone) {
            return res.status(400).json({ message: 'Vui lòng nhập tên và số điện thoại khách' });
        }
        if (!/^[0-9+\s.-]{8,15}$/.test(guestPhone)) {
            return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
        }
        if (!partySize || partySize < 1 || partySize > 50) {
            return res.status(400).json({ message: 'Số khách phải từ 1 đến 50' });
        }
        const dup = await Waitlist.findOne({ where: { guestPhone, status: ACTIVE } });
        if (dup) {
            return res.status(409).json({ message: 'Số điện thoại này đang có trong hàng chờ' });
        }
        const estimatedWaitMinutes = await estimateWait(partySize);
        const entry = await Waitlist.create({
            guestName, guestPhone, partySize, note: req.body.note || null, estimatedWaitMinutes,
        });
        res.status(201).json({ message: 'Đã thêm vào hàng chờ', data: entry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Danh sách đang chờ (mặc định) kèm thứ tự, thời gian chờ hiện tại và bàn gợi ý
exports.listEntries = async (req, res) => {
    try {
        const status = req.query.status;
        const where = status === 'all' ? {} : { status: status ? status.split(',') : ACTIVE };
        const rows = await Waitlist.findAll({ where, order: [['created_at', 'ASC']] });
        const active = rows.filter(r => ACTIVE.includes(r.status));
        const data = [];
        for (const r of rows) {
            const item = r.toJSON();
            if (ACTIVE.includes(r.status)) {
                item.position = active.indexOf(r) + 1;
                item.waitedMinutes = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 60000);
                const t = await findSuggestedTable(r.partySize);
                item.suggestedTable = t ? { id: t.id, tableNumber: t.tableNumber, capacity: t.capacity } : null;
            }
            data.push(item);
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Báo khách có bàn. Hệ thống chưa gửi SMS thật, trả về nội dung tin nhắn để lễ tân gọi/nhắn.
exports.notifyEntry = async (req, res) => {
    try {
        const entry = await Waitlist.findByPk(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Không tìm thấy khách trong hàng chờ' });
        if (!ACTIVE.includes(entry.status)) {
            return res.status(400).json({ message: `Không thể báo khách ở trạng thái ${entry.status}` });
        }
        const table = await findSuggestedTable(entry.partySize);
        await entry.update({ status: 'NOTIFIED', notifiedAt: new Date() });
        const message = `FutureSushi: Anh/chị ${entry.guestName}, nhà hàng đã có bàn${table ? ` số ${table.tableNumber}` : ''} cho ${entry.partySize} khách. Vui lòng đến quầy lễ tân trong 10 phút.`;
        res.status(200).json({ message: 'Đã đánh dấu đã báo khách', data: entry, smsText: message, suggestedTable: table });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xếp khách vào bàn: bàn phải đang AVAILABLE
exports.seatEntry = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const entry = await Waitlist.findByPk(req.params.id, { transaction: t });
        if (!entry || !ACTIVE.includes(entry.status)) {
            await t.rollback();
            return res.status(404).json({ message: 'Khách không còn trong hàng chờ' });
        }
        const table = await RestaurantTable.findByPk(req.body.table_id, { transaction: t, lock: t.LOCK.UPDATE });
        if (!table) {
            await t.rollback();
            return res.status(404).json({ message: 'Không tìm thấy bàn' });
        }
        if (table.status !== 'AVAILABLE') {
            await t.rollback();
            return res.status(400).json({ message: `Bàn ${table.tableNumber} không trống (${table.status})` });
        }
        await table.update({ status: 'OCCUPIED' }, { transaction: t });
        await entry.update({ status: 'SEATED', seatedAt: new Date(), table_id: table.id }, { transaction: t });
        await t.commit();
        res.status(200).json({ message: `Đã xếp khách vào bàn ${table.tableNumber}`, data: entry });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['CANCELLED', 'NO_SHOW'].includes(status)) {
            return res.status(400).json({ message: 'Chỉ cho phép CANCELLED hoặc NO_SHOW' });
        }
        const entry = await Waitlist.findByPk(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Không tìm thấy khách trong hàng chờ' });
        if (!ACTIVE.includes(entry.status)) {
            return res.status(400).json({ message: 'Khách đã được xử lý trước đó' });
        }
        await entry.update({ status });
        res.status(200).json({ message: 'Đã cập nhật', data: entry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
