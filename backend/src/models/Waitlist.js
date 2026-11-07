const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Waitlist', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        guestName: { type: DataTypes.STRING(100), allowNull: false },
        guestPhone: { type: DataTypes.STRING(20), allowNull: false },
        partySize: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
        note: { type: DataTypes.TEXT },
        status: {
            type: DataTypes.ENUM('WAITING', 'NOTIFIED', 'SEATED', 'CANCELLED', 'NO_SHOW'),
            defaultValue: 'WAITING',
        },
        estimatedWaitMinutes: { type: DataTypes.INTEGER, defaultValue: 0 },
        notifiedAt: { type: DataTypes.DATE },
        seatedAt: { type: DataTypes.DATE },
        table_id: { type: DataTypes.BIGINT, allowNull: true },
    }, {
        tableName: 'waitlist',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};
