const ServerError = require('./server-error');

class InvalidUserOrPasswordError extends ServerError {
  constructor() {
    super(401, 'Некорректный пользователь или пароль');
  }
}

module.exports = InvalidUserOrPasswordError;
