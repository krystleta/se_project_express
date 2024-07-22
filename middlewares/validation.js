const { Joi, celebrate } = require('celebrate');
const validator = require('validator');


// separate url validation function
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// New user
module.exports.validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field is required.',
    }),
    password: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "password" field is 2.',
      "string.max": 'The maximum length of the "password" field is 30.',
      "string.empty": 'The "password" field must be filled in.',
    }),
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2.',
      "string.max": 'The maximum length of the "name" field is 30.',
      "string.empty": 'The "name" field must be filled in.',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in.',
      "string.uri": 'the "avatar" field must be a valid url.',
    }),
  }),
});

// Returning user
module.exports.validateReturningUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field is required.',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field is required.',
    }),
  }),
});

// Item validation
module.exports.validateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2.',
      "string.max": 'The maximum length of the "name" field is 30.',
      "string.empty": 'The "name" field must be filled in.',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in.',
      "string.uri": 'the "imageUrl" field must be a valid url.',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": 'Please fill out one of the "weather" fields.',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().optional().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2.',
      "string.max": 'The maximum length of the "name" field is 30.',
    }),
    avatar: Joi.string().optional().custom(validateURL).messages({
      "string.uri": 'the "avatar" field must be a valid url.',
    }),
  }),
});