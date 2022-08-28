const ServerError = require('./server-error');

class UserAlreadyExistsError extends ServerError {
  constructor() {
    super(409, 'Пользователь с указанным email уже существует');
  }
}

module.exports = UserAlreadyExistsError;
