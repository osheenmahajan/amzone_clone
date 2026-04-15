const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'amazon_clone_secret_key';

class AuthService {
  async register(name, email, password) {
    const existingUser = await authRepository.getUserByEmail(email);
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 400;
      throw error;
    }

    // Hash the raw password natively over 10 salt rounds for security
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = await authRepository.createUser(name, email, passwordHash);
    
    // Auto sign-in post registration
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: userId, name, email } };
  }

  async login(email, password) {
    const user = await authRepository.getUserByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}

module.exports = new AuthService();
