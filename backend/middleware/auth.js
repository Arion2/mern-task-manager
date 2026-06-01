const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader); // ← shto

  const token = authHeader?.replace('Bearer ', '');
  console.log('Token:', token); // ← shto

  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded); // ← shto
    req.user = decoded;
    next();
  } catch (err) {
    console.log('JWT error:', err.message); // ← shto
    res.status(401).json({ message: 'Token invalid' });
  }
};