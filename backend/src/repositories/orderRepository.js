const db = require('../config/db');

class OrderRepository {
  async runTransaction(callback) {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async createOrder(connection, userId, totalAmount, shippingAddress) {
    const query = `
      INSERT INTO orders (user_id, total_amount, shipping_address)
      VALUES (?, ?, ?)
    `;
    const [result] = await connection.execute(query, [userId, totalAmount, shippingAddress]);
    return result.insertId;
  }

  async createOrderItem(connection, orderId, productId, quantity, price) {
    const query = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `;
    await connection.execute(query, [orderId, productId, quantity, price]);
  }

  async getOrderById(id, userId) {
    const query = `
      SELECT id, total_amount, shipping_address, created_at
      FROM orders
      WHERE id = ? AND user_id = ?
    `;
    const [rows] = await db.execute(query, [id, userId]);
    return rows[0] || null;
  }

  async getUserOrders(userId) {
    const query = `
      SELECT id, total_amount, shipping_address, created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }

  async getOrderItems(orderId) {
    const query = `
      SELECT oi.quantity, oi.price, p.name as product
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    const [rows] = await db.execute(query, [orderId]);
    return rows;
  }
}

module.exports = new OrderRepository();
