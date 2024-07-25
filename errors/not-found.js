const { RESPONSE_CODES } = require("../utils/errors");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.NOT_FOUND;
    this.name = "NotFoundError";
  }
}

module.exports = { NotFoundError };