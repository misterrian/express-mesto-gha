const ServerError = require('./server-error');

class InvalidRoute extends ServerError {
  constructor() {
    super(404, 'Некорректный путь');
  }
}

module.exports = InvalidRoute;
