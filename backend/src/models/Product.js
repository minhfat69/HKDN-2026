const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Product', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        description: { type: DataTypes.TEXT },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        costPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        image: { type: DataTypes.TEXT },
        stock: { type: DataTypes.INTEGER, defaultValue: 100 },
        isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
        isSecretMenu: { type: DataTypes.BOOLEAN, defaultValue: false },
        category_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: { model: 'categories', key: 'id' }
        },
    }, {
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};
