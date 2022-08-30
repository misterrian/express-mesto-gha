const { celebrate, Joi } = require('celebrate');
const { linkRegExp } = require('../utils/utils');

const loginValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
});

const createUserValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .pattern(linkRegExp),
    }),
});

const getUserValidator = celebrate({
  params: Joi.object()
    .keys({
      userId: Joi
        .string()
        .required()
        .hex()
        .length(24),
    }),
});

const updateProfileValidator = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
});

const updateAvatarValidator = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi
        .string()
        .required()
        .pattern(linkRegExp),
    }),
});

module.exports = {
  loginValidator,
  createUserValidator,
  getUserValidator,
  updateProfileValidator,
  updateAvatarValidator,
};
