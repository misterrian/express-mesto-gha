const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      req.user = jwt.verify(token, 'some-secret-key');
      next();
    } catch (err) {
      next(new UnauthorizedError('Некорректный пользователь или пароль'));
    }
  } else {
    next(new UnauthorizedError('Некорректный пользователь или пароль'));
  }
};

module.exports = {
  auth,
};
