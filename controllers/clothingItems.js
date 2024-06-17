const ClothingItem = require("../models/clothingItem");
const RESPONSE_CODES = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) =>
      res.status(RESPONSE_CODES.REQUEST_CREATED).send({ data: item })
    )
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

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
        .status(RESPONSE_CODES.FORBIDDEN)
        .send({ message: "You are not authorized to perform this action." });
      }
      return item
      .deleteOne()
      .then(() => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send({ data: item }));
    })
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

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) =>
      res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send({ data: item })
    )
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

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) =>
      res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send({ data: item })
    )
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

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
