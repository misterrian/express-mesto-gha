const ServerError = require('./server-error');

class UserNotFoundError extends ServerError {
  constructor() {
    super(404, 'Запрашиваемый пользователь не найден');
  }
}

module.exports = UserNotFoundError;
