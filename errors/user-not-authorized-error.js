const ServerError = require('./server-error');

class UserIsNotAuthorizedError extends ServerError {
  constructor() {
    super(401, 'Пользователь не авторизован');
  }
}

module.exports = UserIsNotAuthorizedError;
