const RestaurantTable = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    bulkCreate: jest.fn()
};

const Reservation = {
    findOne: jest.fn()
};

const Order = {
    findOne: jest.fn()
};

module.exports = {
    RestaurantTable,
    Reservation,
    Order
};