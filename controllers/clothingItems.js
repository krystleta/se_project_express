const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  RESPONSE_CODES
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) =>
      res.status(RESPONSE_CODES.REQUEST_CREATED).send({ data: item })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data")); // Use custom error
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send(items))
    .catch((err) => {
      console.error(err);
      next(err); // Pass the error to the centralized error-handling middleware
    });
};

const deleteItem = (req, res, next) => {
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
        .then(() =>
          res.status(RESPONSE_CODES.REQUEST_SUCCESSFUL).send({ data: item })
        );
    })
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

const likeItem = (req, res, next) => {
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

      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Item not found')); // Provide a consistent message
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid item ID')); // Provide a consistent message
      } else {
        next(err); // Pass the error to the centralized error handler
      }
    });
};

const dislikeItem = (req, res, next) => {
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

      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Item not found')); // Provide a consistent message
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid item ID')); // Provide a consistent message
      } else {
        next(err); // Pass the error to the centralized error handler
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
