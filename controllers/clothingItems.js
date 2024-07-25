const ClothingItem = require("../models/clothingItem");
const { RESPONSE_CODES } = require("../utils/errors");
const { BadRequestError } = require("../errors/bad-request");
const { NotFoundError } = require("../errors/not-found");
const { ForbiddenError } = require("../errors/forbidden");

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
        next(new BadRequestError("Invalid data"));
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
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return next(new ForbiddenError('You are not authorized to perform this action'));
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
        next(new NotFoundError('Item not found'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid item ID'));
      } else {
        next(err);
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
        next(new NotFoundError('Item not found'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid item ID'));
      } else {
        next(err);
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
        next(new NotFoundError('Item not found'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid item ID'));
      } else {
        next(err);
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
