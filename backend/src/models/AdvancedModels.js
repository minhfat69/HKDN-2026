const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Voucher = sequelize.define('Voucher', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
        discountType: { type: DataTypes.ENUM('PERCENT', 'FIXED'), defaultValue: 'FIXED' },
        discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        minOrderValue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        maxDiscount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
        usageLimit: { type: DataTypes.INTEGER, defaultValue: 100 },
        usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
        expiredAt: { type: DataTypes.DATE, allowNull: true },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, { tableName: 'vouchers', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

    const Shift = sequelize.define('Shift', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        staff_id: { type: DataTypes.BIGINT, allowNull: true },
        openingCash: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        closingCashActual: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
        expectedCash: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
        discrepancy: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
        status: { type: DataTypes.ENUM('OPEN', 'CLOSED'), defaultValue: 'OPEN' },
        openedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        closedAt: { type: DataTypes.DATE, allowNull: true },
        note: { type: DataTypes.TEXT }
    }, { tableName: 'shifts', timestamps: false });

    const Ingredient = sequelize.define('Ingredient', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        barcode: { type: DataTypes.STRING(100), unique: true, allowNull: false },
        name: { type: DataTypes.STRING(150), allowNull: false },
        unit: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'gram' },
        totalQuantity: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
        costPerUnit: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        minThreshold: { type: DataTypes.DECIMAL(12, 2), defaultValue: 500 }
    }, { tableName: 'ingredients', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

    const InventoryBatch = sequelize.define('InventoryBatch', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        ingredient_id: { type: DataTypes.BIGINT, allowNull: false },
        batchCode: { type: DataTypes.STRING(100), allowNull: false },
        quantityImported: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        quantityRemaining: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        unitCost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        mfgDate: { type: DataTypes.DATEONLY, allowNull: false },
        expDate: { type: DataTypes.DATEONLY, allowNull: false }
    }, { tableName: 'inventory_batches', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

    const Recipe = sequelize.define('Recipe', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        product_id: { type: DataTypes.BIGINT, allowNull: false },
        ingredient_id: { type: DataTypes.BIGINT, allowNull: false },
        amountRequired: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, { tableName: 'recipes', timestamps: false });

    return { Voucher, Shift, Ingredient, InventoryBatch, Recipe };
};
