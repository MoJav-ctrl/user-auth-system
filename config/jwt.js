const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('./config');

const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: jwtExpiration });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = {
  jwtSecret,
  generateToken,
  verifyToken
};

