const User = require("../models/user");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
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
          return res
            .status(RESPONSE_CODES.INVALID_DATA)
            .send({ message: "Invalid data." });
        }
        if (err.name === "MongoServerError" && err.code === 11000) {
          return res
            .status(RESPONSE_CODES.CONFLICT)
            .send({ message: "This email address already exists." });
        }
        return res
          .status(RESPONSE_CODES.SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      });
  });
  // } else {
  //   const ConflictError = new Error(
  //     "Email address has already been used, please try another email address."
  //   );
  //   //ConflictError.statusCode = RESPONSE_CODES.CONFLICT;
  //   throw ConflictError;
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(RESPONSE_CODES.NOT_FOUND)
          .send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(RESPONSE_CODES.INVALID_DATA)
          .send({ message: "Invalid data." });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUser = (req, res) => {
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
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(RESPONSE_CODES.NOT_FOUND)
          .send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(RESPONSE_CODES.INVALID_DATA)
          .send({ message: "Invalid data." });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const loginUser = (req, res) => {
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
