import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use Hostinger MySQL database for production, local MySQL for development
const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'u882715919_adsiri_growth',
  process.env.DB_USER || 'u882715919_root',
  process.env.DB_PASSWORD || 'Adsiri@password23',
  {
    host: process.env.DB_HOST || '147.93.101.81',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: isDevelopment ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
);

export default sequelize; 