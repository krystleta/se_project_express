const { RESPONSE_CODES } = require("../utils/errors");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.UNAUTHORIZED;
    this.name = "UnauthorizedError";
  }
}

module.exports = { UnauthorizedError };