const ServerError = require('./server-error');

class UnauthorizedError extends ServerError {
  constructor(message) {
    super(401, message);
  }
}

module.exports = UnauthorizedError;
