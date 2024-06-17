const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res) => {
  res
    .status(RESPONSE_CODES.UNAUTHORIZED)
    .send({ message: "Authorization Error." });
};

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};

module.exports = { auth };
