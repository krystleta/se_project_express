const User = require("../models/user");
const RESPONSE_CODES = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(RESPONSE_CODES.REQUEST_CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(RESPONSE_CODES.INVALID_DATA)
          .send({ message: "Invalid data." });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
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

module.exports = { getUsers, createUser, getUser };
