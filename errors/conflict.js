const { RESPONSE_CODES } = require("../utils/errors");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.CONFLICT;
    this.name = "ConflictError";
  }
}

module.exports = { ConflictError };