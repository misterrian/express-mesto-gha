const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  addCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

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
          .required(),
      }),
  }),
  addCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.number()
          .integer()
          .required(),
      }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.number()
          .integer()
          .required(),
      }),
  }),
  addLike,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.number()
          .integer()
          .required(),
      }),
  }),
  removeLike,
);

module.exports = router;
