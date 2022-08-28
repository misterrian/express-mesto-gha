const ServerError = require('./server-error');

class InvalidParametersError extends ServerError {
  constructor() {
    super(400, 'Переданы некорректные данные');
  }
}

module.exports = InvalidParametersError;
