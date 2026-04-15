const mysql = require('mysql2/promise');
const { dbParams } = require('./env');

const pool = mysql.createPool(dbParams);

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Failure connecting to database. Please check your credentials in .env:', err.message);
  });

module.exports = pool;
