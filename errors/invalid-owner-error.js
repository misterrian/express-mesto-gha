const ServerError = require('./server-error');

class InvalidOwnerError extends ServerError {
  constructor() {
    super(403, 'Нельзя изменять данные других пользователей');
  }
}

module.exports = InvalidOwnerError;
