const RESPONSE_CODES = {
  REQUEST_SUCCESSFUL: 200,
  REQUEST_CREATED: 201,
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  FORBIDDEN: 403,
};

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.INVALID_DATA;
    this.name = "BadRequestError";
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.UNAUTHORIZED;
    this.name = "UnauthorizedError";
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.FORBIDDEN;
    this.name = "ForbiddenError";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.NOT_FOUND;
    this.name = "NotFoundError";
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.CONFLICT;
    this.name = "ConflictError";
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESPONSE_CODES.SERVER_ERROR;
    this.name = "InternalServerError";
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  RESPONSE_CODES,
}