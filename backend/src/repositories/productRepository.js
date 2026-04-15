const db = require('../config/db');

class ProductRepository {
  async findAll({ search, category }) {
    let query = `
      SELECT p.id, p.name, p.price, p.stock, p.image_url, c.name as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND p.name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (category) {
      query += ` AND c.name = ?`;
      params.push(category);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  async findById(id) {
    const query = `
      SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url, c.name as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new ProductRepository();
