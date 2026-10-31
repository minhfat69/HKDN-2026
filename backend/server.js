const app = require('./src/app');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./src/models');
const { startCleanupTask } = require('./src/services/reservationCleanup');
const { seedTables } = require('./src/seeders/tableSeeder');
const { seedProducts } = require('./src/seeders/productSeeder');
const { seedReservations } = require('./src/seeders/reservationSeeder');
const { seedOrders } = require('./src/seeders/orderSeeder');
const { seedAdmin } = require('./src/seeders/adminSeeder');
const { seedReviews } = require('./src/seeders/reviewSeeder');
dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to Database and sync models
connectDB();

// Đồng bộ database
sequelize.sync().then(async () => {
    console.log('Database synced successfully.');
    try {
        await sequelize.query("ALTER TABLE payments MODIFY COLUMN paymentMethod VARCHAR(50) NOT NULL DEFAULT 'CASH';");
        await sequelize.query("ALTER TABLE orders MODIFY COLUMN paymentMethod VARCHAR(50) NULL;");
        console.log('Database schema column paymentMethod altered successfully.');
    } catch (err) {
        console.log('Column alter note:', err.message);
    }
    await seedAdmin();
    await seedReviews();
    await seedOrders();
    await seedReservations();
    // Khởi động dọn dẹp đặt bàn quá hạn
    startCleanupTask();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
