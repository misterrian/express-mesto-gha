const ServerError = require('./server-error');

class DBError extends ServerError {
  constructor() {
    super(500, 'Произошла ошибка');
  }
}

module.exports = DBError;
