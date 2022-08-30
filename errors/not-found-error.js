const ServerError = require('./server-error');

class NotFoundError extends ServerError {
  constructor(message) {
    super(404, message);
  }
}

module.exports = NotFoundError;
