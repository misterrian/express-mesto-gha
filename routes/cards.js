const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  addCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

const { linkRegExp } = require('../utils/utils');

const router = express.Router();

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string()
          .required()
          .min(2)
          .max(30),
        link: Joi.string()
          .required()
          .pattern(linkRegExp),
      }),
  }),
  addCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .required()
          .hex()
          .length(24),
      }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .required()
          .hex()
          .length(24),
      }),
  }),
  addLike,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .required()
          .hex()
          .length(24),
      }),
  }),
  removeLike,
);

module.exports = router;
