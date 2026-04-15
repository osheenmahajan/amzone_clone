const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'amazon_clone_secret_key');
    req.user = decoded; // Contains { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};
