const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Order', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        orderType: {
            type: DataTypes.ENUM("DINE_IN", "DELIVERY", "TAKEAWAY"),
            defaultValue: "DINE_IN"
        },
        deliveryAddress: { type: DataTypes.TEXT, allowNull: true },
        recipientPhone: { type: DataTypes.STRING(20), allowNull: true },
        voucherCode: { type: DataTypes.STRING(50), allowNull: true },
        totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        discountAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        vatAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        finalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        note: { type: DataTypes.TEXT },
        cancelReason: { type: DataTypes.STRING(255), allowNull: true },
        isWaste: { type: DataTypes.BOOLEAN, defaultValue: false },
        isRecipeDeducted: { type: DataTypes.BOOLEAN, defaultValue: false },
        status: {
            type: DataTypes.ENUM("PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"),
            defaultValue: "PENDING",
        },
        paymentStatus: {
            type: DataTypes.ENUM("UNPAID", "PAID"),
            defaultValue: "UNPAID",
        },
        paymentMethod: { type: DataTypes.STRING(50), allowNull: true },
        isPointsAdded: { type: DataTypes.BOOLEAN, defaultValue: false },
    }, {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};
