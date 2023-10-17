const jwt = require('jsonwebtoken');
const secretKey = require('../config/auth')

const generateToken = (user) => {
  const token = jwt.sign({ user }, secretKey.secret, { expiresIn: '1h' });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey.secret );
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};