const path = require('path');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const dbName = process.env.DB_NAME || 'appdatmon';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
});

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: dbHost,
            port: dbPort,
            user: dbUser,
            password: dbPassword
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await connection.end();

        await sequelize.authenticate();
        console.log(`MySQL connected successfully to '${dbName}' via Sequelize.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
