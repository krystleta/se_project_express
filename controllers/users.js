const jwt = require("jsonwebtoken");
const bcrpyt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RESPONSE_CODES,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(RESPONSE_CODES.INVALID_DATA)
      .send({ message: "Email address and password are required." });
  }

  return bcrpyt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userInfo = user.toObject();
        delete userInfo.password;
        return res
          .status(RESPONSE_CODES.REQUEST_SUCCESSFUL)
          .send({ data: userInfo });
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          next(new BadRequestError("Invalid data")); // Use custom error
        } else if (err.name === "MongoServerError" && err.code === 11000) {
          next(new ConflictError('This email address already exists.')); // Provide a consistent message
        } else {
          next(err); // Pass the error to the centralized error handler
        }
      });
  });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Item not found')); // Provide a consistent message
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid item ID')); // Provide a consistent message
      } else {
        next(err); // Pass the error to the centralized error handler
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Item not found')); // Provide a consistent message
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid item ID')); // Provide a consistent message
      } else {
        next(err); // Pass the error to the centralized error handler
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(RESPONSE_CODES.INVALID_DATA)
      .send({ message: "Email address and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send({
        message: "Authentication successful",
        user: { name: user.name, avatar: user.avatar },
        token,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password.") {
        return res
          .status(RESPONSE_CODES.UNAUTHORIZED)
          .send({ message: "Incorrect email or password." });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { updateUser, createUser, getCurrentUser, loginUser };
