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
          .send({ message: err.message });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) =>
      res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send({ data: item })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(RESPONSE_CODES.INVALID_DATA)
          .send({ message: err.message });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

//delete
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send({}))
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
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: err.message });
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
      } else if (err.name === "CastError") {
        return res
          .status(RESPONSE_CODES.INVALID_DATA)
          .send({ message: err.message });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: err.message });
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
      } else if (err.name === "CastError") {
        return res
          .status(RESPONSE_CODES.INVALID_DATA)
          .send({ message: err.message });
      }
      return res
        .status(RESPONSE_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
