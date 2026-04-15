require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  dbParams: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amazon_clone',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
};
