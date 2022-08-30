const ServerError = require('./server-error');

class ConflictError extends ServerError {
  constructor(message) {
    super(409, message);
  }
}

module.exports = ConflictError;
