const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const { sendMessage } = require('../utils/utils');

const {
  DB_ERROR,
  INVALID_CARD_ID,
  CARD_NOT_FOUND,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => sendMessage(res, DB_ERROR, 'Произошла ошибка'));
};

const addCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ owner: req.user._id, name, link })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        sendMessage(res, 400, 'Переданые некорректные данные карточки');
      } else {
        sendMessage(res, DB_ERROR, 'Произошла ошибка');
      }
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndRemove({ owner: req.user._id, _id: req.params.cardId })
    .populate('owner')
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        sendMessage(res, INVALID_CARD_ID, 'Некоректный id карточки');
      } else if (err instanceof DocumentNotFoundError) {
        sendMessage(res, CARD_NOT_FOUND, 'Запрашиваемая карточка не найдена');
      } else {
        sendMessage(res, DB_ERROR, 'Произошла ошибка');
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        sendMessage(res, INVALID_CARD_ID, 'Некоректный id карточки');
      } else if (err instanceof DocumentNotFoundError) {
        sendMessage(res, CARD_NOT_FOUND, 'Запрашиваемая карточка не найдена');
      } else {
        sendMessage(res, DB_ERROR, 'Произошла ошибка');
      }
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        sendMessage(res, INVALID_CARD_ID, 'Некоректный id карточки');
      } else if (err instanceof DocumentNotFoundError) {
        sendMessage(res, CARD_NOT_FOUND, 'Запрашиваемая карточка не найдена');
      } else {
        sendMessage(res, DB_ERROR, 'Произошла ошибка');
      }
    });
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  addLike,
  removeLike,
};
