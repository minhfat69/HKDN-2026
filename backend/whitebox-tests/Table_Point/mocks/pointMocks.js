const User = {
    findOne: jest.fn()
};

const Order = {
    findByPk: jest.fn()
};

const sequelize = {
    transaction: jest.fn()
};

module.exports = {
    User,
    Order,
    sequelize
};