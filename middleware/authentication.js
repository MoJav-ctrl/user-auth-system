const passport = require('passport');

// Middleware to verify JWT token for protected routes
const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized: Expired token' });
    }
    req.user = user;
    next();
  })(req, res, next);
}

module.exports = { authenticateJWT };