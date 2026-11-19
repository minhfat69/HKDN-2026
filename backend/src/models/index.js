const { sequelize, connectDB } = require('../configs/db');

const User = require('./User')(sequelize);
const RestaurantTable = require('./RestaurantTable')(sequelize);
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const Cart = require('./Cart')(sequelize);
const CartItem = require('./CartItem')(sequelize);
const Reservation = require('./Reservation')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Payment = require('./Payment')(sequelize);
const Review = require('./Review')(sequelize);
const Notification = require('./Notification')(sequelize);
const Waitlist = require('./Waitlist')(sequelize);
const { Voucher, Shift, Ingredient, InventoryBatch, Recipe, InventoryTransaction, VoidLog } = require('./AdvancedModels')(sequelize);

Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

User.hasOne(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Cart.hasMany(CartItem, { foreignKey: "cart_id" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(Reservation, { foreignKey: "user_id", as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: "user_id", as: 'User' });

RestaurantTable.hasMany(Reservation, { foreignKey: "table_id", as: 'reservations' });
Reservation.belongsTo(RestaurantTable, { foreignKey: "table_id", as: 'table' });

User.hasMany(Order, { foreignKey: "user_id", as: 'orders' });
Order.belongsTo(User, { foreignKey: "user_id", as: 'User' });

RestaurantTable.hasMany(Order, { foreignKey: "table_id", as: 'orders' });
Order.belongsTo(RestaurantTable, { foreignKey: "table_id", as: 'RestaurantTable' });

Reservation.hasMany(Order, { foreignKey: "reservation_id" });
Order.belongsTo(Reservation, { foreignKey: "reservation_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id", as: 'OrderItems' });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: 'Product' });

Order.hasOne(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

User.hasMany(Review, { foreignKey: "user_id", as: 'reviews' });
Review.belongsTo(User, { foreignKey: "user_id", as: 'user' });

// Waitlist của Claude
RestaurantTable.hasMany(Waitlist, { foreignKey: 'table_id', as: 'waitlistEntries' });
Waitlist.belongsTo(RestaurantTable, { foreignKey: 'table_id', as: 'table' });

// Kho, Lô hàng, Định lượng công thức (Recipe) & Ca làm việc
Ingredient.hasMany(InventoryBatch, { foreignKey: 'ingredient_id', as: 'batches' });
InventoryBatch.belongsTo(Ingredient, { foreignKey: 'ingredient_id', as: 'ingredient' });

Product.hasMany(Recipe, { foreignKey: 'product_id', as: 'recipes' });
Recipe.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Ingredient.hasMany(Recipe, { foreignKey: 'ingredient_id', as: 'recipes' });
Recipe.belongsTo(Ingredient, { foreignKey: 'ingredient_id', as: 'ingredient' });

User.hasMany(Shift, { foreignKey: 'staff_id', as: 'shifts' });
Shift.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Voucher.hasMany(Order, { foreignKey: 'voucher_id', as: 'orders' });
Order.belongsTo(Voucher, { foreignKey: 'voucher_id', as: 'voucher' });

Ingredient.hasMany(InventoryTransaction, { foreignKey: 'ingredient_id', as: 'transactions' });
InventoryTransaction.belongsTo(Ingredient, { foreignKey: 'ingredient_id', as: 'ingredient' });
InventoryBatch.hasMany(InventoryTransaction, { foreignKey: 'batch_id', as: 'transactions' });
InventoryTransaction.belongsTo(InventoryBatch, { foreignKey: 'batch_id', as: 'batch' });

OrderItem.hasMany(VoidLog, { foreignKey: 'order_item_id', as: 'voidLogs' });
VoidLog.belongsTo(OrderItem, { foreignKey: 'order_item_id', as: 'orderItem' });
User.hasMany(VoidLog, { foreignKey: 'authorizedBy', as: 'authorizedVoidLogs' });
VoidLog.belongsTo(User, { foreignKey: 'authorizedBy', as: 'authorizer' });

module.exports = {
    sequelize,
    connectDB,
    User,
    RestaurantTable,
    Category,
    Product,
    Cart,
    CartItem,
    Reservation,
    Order,
    OrderItem,
    Payment,
    Review,
    Notification,
    Waitlist,
    Voucher,
    Shift,
    Ingredient,
    InventoryBatch,
    Recipe,
    InventoryTransaction,
    VoidLog
};
