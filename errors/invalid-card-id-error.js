const ServerError = require('./server-error');

class InvalidCardIdError extends ServerError {
  constructor() {
    super(400, 'Некоректный id карточки');
  }
}

module.exports = InvalidCardIdError;
