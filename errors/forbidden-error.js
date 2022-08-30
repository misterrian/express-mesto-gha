const ServerError = require('./server-error');

class ForbiddenError extends ServerError {
  constructor(message) {
    super(403, message);
  }
}

module.exports = ForbiddenError;
