const passport = require('passport');
const { ApiError } = require('../utils/errorHandler');

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return next(new ApiError(401, 'Unauthorized'));
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;

