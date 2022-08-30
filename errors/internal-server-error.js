const ServerError = require('./server-error');

class InternalServerError extends ServerError {
  constructor(message) {
    super(500, message);
  }
}

module.exports = InternalServerError;
