const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const { sendMessage } = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => sendMessage(res, 500, 'Произошла ошибка'));
};

const addCard = (req, res) => {
  const { name, link } = req.body;

  if (Object.keys(req.body).length > 2) {
    sendMessage(res, 400, 'Переданы лишние параметры');
  } else if (!name) {
    sendMessage(res, 400, 'Не указано имя карточки');
  } else if (!link) {
    sendMessage(res, 400, 'Не указана ссылка на карточку');
  } else {
    Card.create({ owner: req.user._id, name, link })
      .then((card) => card.populate('owner'))
      .then((card) => res.send(card))
      .catch((err) => {
        if (err instanceof ValidationError) {
          sendMessage(res, 400, 'Переданые некорректные данные карточки');
        } else {
          sendMessage(res, 500, 'Произошла ошибка');
        }
      });
  }
};

const deleteCard = (req, res) => {
  Card.findOneAndRemove({ owner: req.user._id, _id: req.params.cardId })
    .populate('owner')
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        sendMessage(res, 404, 'Запрашиваемая карточка не найдена');
      } else {
        sendMessage(res, 500, 'Произошла ошибка');
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
      if (err instanceof DocumentNotFoundError) {
        sendMessage(res, 404, 'Запрашиваемая карточка не найдена');
      } else {
        sendMessage(res, 500, 'Произошла ошибка');
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
      if (err instanceof DocumentNotFoundError) {
        sendMessage(res, 404, 'Запрашиваемая карточка не найдена');
      } else {
        sendMessage(res, 500, 'Произошла ошибка');
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
