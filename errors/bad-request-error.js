const ServerError = require('./server-error');

class BadRequestError extends ServerError {
  constructor(message) {
    super(400, message);
  }
}

module.exports = BadRequestError;
