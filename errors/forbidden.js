const { RESPONSE_CODES } = require("../utils/errors");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.FORBIDDEN;
    this.name = "ForbiddenError";
  }
}

module.exports = { ForbiddenError };