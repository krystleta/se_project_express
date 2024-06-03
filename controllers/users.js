const User = require("../models/user");
const RESPONSE_CODES = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(RESPONSE_CODES.REQUEST_CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "AssertionError") {
        return res
          .status(RESPONSE_CODES.INVALID_DATA)
          .send({ message: err.message });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(RESPONSE_CODES.NOT_FOUND)
          .send({ message: err.message });
      } else if (err.name === "CastError") {
        return res
          .status(RESPONSE_CODES.INVALID_DATA)
          .send({ message: err.message });
      } else {
        return res
          .status(RESPONSE_CODES.SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
