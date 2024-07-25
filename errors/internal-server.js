const { RESPONSE_CODES } = require("../utils/errors");

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.SERVER_ERROR;
    this.name = "InternalServerError";
  }
}

module.exports = { InternalServerError };