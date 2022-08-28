const jwt = require('jsonwebtoken');

const InvalidUserOrPasswordError = require('../errors/invalid-user-or-password-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      req.user = jwt.verify(token, 'some-secret-key');
      next();
    } catch (err) {
      throw new InvalidUserOrPasswordError();
    }
  } else {
    throw new InvalidUserOrPasswordError();
  }
};

module.exports = {
  auth,
};