const { RESPONSE_CODES } = require("../utils/errors");

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.INVALID_DATA;
    this.name = "BadRequestError";
  }
}

module.exports = { BadRequestError };