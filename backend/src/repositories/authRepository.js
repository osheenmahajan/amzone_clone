const db = require('../config/db');

class AuthRepository {
  async createUser(name, email, passwordHash) {
    const query = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [name, email, passwordHash]);
    return result.insertId;
  }

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0] || null;
  }

  async getUserById(id) {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new AuthRepository();
