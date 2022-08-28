const ServerError = require('./server-error');

class InvalidUserIdError extends ServerError {
  constructor() {
    super(400, 'Некорректный id пользователя');
  }
}

module.exports = InvalidUserIdError;
