const ServerError = require('./server-error');

class CardNotFoundError extends ServerError {
  constructor() {
    super(404, 'Запрашиваемая карточка не найдена');
  }
}

module.exports = CardNotFoundError;
