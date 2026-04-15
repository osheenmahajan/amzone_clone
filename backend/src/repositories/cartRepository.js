const db = require('../config/db');

class CartRepository {
  async getCartItems(userId) {
    const query = `
      SELECT ci.product_id, p.name, p.price, p.image_url, ci.quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }

  async findCartItem(userId, productId) {
    const query = `
      SELECT id, quantity FROM cart_items 
      WHERE user_id = ? AND product_id = ?
    `;
    const [rows] = await db.execute(query, [userId, productId]);
    return rows[0] || null;
  }

  async addItem(userId, productId, quantity) {
    const query = `
      INSERT INTO cart_items (user_id, product_id, quantity) 
      VALUES (?, ?, ?)
    `;
    await db.execute(query, [userId, productId, quantity]);
  }

  async updateItemQuantity(userId, productId, quantity) {
    const query = `
      UPDATE cart_items 
      SET quantity = ? 
      WHERE user_id = ? AND product_id = ?
    `;
    await db.execute(query, [quantity, userId, productId]);
  }

  async removeItem(userId, productId) {
    const query = `
      DELETE FROM cart_items 
      WHERE user_id = ? AND product_id = ?
    `;
    await db.execute(query, [userId, productId]);
  }
}

module.exports = new CartRepository();
