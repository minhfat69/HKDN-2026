const bcrypt = require("bcryptjs");
const { User, Voucher } = require("../models");

const seedAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash("123", 10);

        const defaultAccounts = [
            {
                fullName: "Administrator",
                email: "admin@example.com",
                phone: "0900000000",
                username: "admin",
                password: hashedPassword,
                role: "ADMIN",
                tier: "VIP",
                membershipTier: "VIP",
                status: "ACTIVE",
                points: 1000
            },
            {
                fullName: "Lễ tân Sảnh (Host)",
                email: "host@futuresushi.com",
                phone: "0900000001",
                username: "host",
                password: hashedPassword,
                role: "HOST",
                status: "ACTIVE",
                points: 0
            },
            {
                fullName: "Thu ngân & Phục vụ (Staff)",
                email: "staff@futuresushi.com",
                phone: "0900000002",
                username: "staff",
                password: hashedPassword,
                role: "STAFF",
                status: "ACTIVE",
                points: 0
            },
            {
                fullName: "Đầu bếp KDS (Kitchen)",
                email: "kitchen@futuresushi.com",
                phone: "0900000003",
                username: "kitchen",
                password: hashedPassword,
                role: "KITCHEN",
                status: "ACTIVE",
                points: 0
            },
            {
                fullName: "Nguyễn Văn Thành Viên (Vàng)",
                email: "member@futuresushi.com",
                phone: "0901234567",
                username: "member",
                password: hashedPassword,
                role: "CUSTOMER",
                tier: "GOLD",
                membershipTier: "VANG",
                status: "ACTIVE",
                points: 50000,
                totalSpent: 2500000
            },
            {
                fullName: "Trần Thị Khách VIP",
                email: "vip@futuresushi.com",
                phone: "0909999999",
                username: "vip",
                password: hashedPassword,
                role: "CUSTOMER",
                tier: "VIP",
                membershipTier: "VIP",
                status: "ACTIVE",
                points: 150000,
                totalSpent: 6000000
            }
        ];

        for (const acc of defaultAccounts) {
            const exists = await User.findOne({ where: { username: acc.username } });
            if (!exists) {
                const phoneExists = await User.findOne({ where: { phone: acc.phone } });
                if (!phoneExists) {
                    await User.create(acc);
                }
            }
        }

        if (Voucher && typeof Voucher.findOne === "function") {
            const defaultVouchers = [
                {
                    code: "SUSHI50K",
                    discountType: "FIXED",
                    discountValue: 50000,
                    minOrderValue: 100000,
                    usageLimit: 500,
                    isActive: true
                },
                {
                    code: "VIP10",
                    discountType: "PERCENT",
                    discountValue: 10,
                    minOrderValue: 100000,
                    maxDiscount: 100000,
                    usageLimit: 500,
                    isActive: true
                },
                {
                    code: "WELCOME20K",
                    discountType: "FIXED",
                    discountValue: 20000,
                    minOrderValue: 50000,
                    usageLimit: 500,
                    isActive: true
                }
            ];
            for (const v of defaultVouchers) {
                const vExists = await Voucher.findOne({ where: { code: v.code } });
                if (!vExists) {
                    await Voucher.create(v);
                }
            }
        }

        console.log("[AdminSeeder] Đã đồng bộ tài khoản mặc định & Voucher mẫu thành công.");
    } catch (err) {
        console.error("[AdminSeeder]", err);
    }
};

module.exports = {
    seedAdmin
};