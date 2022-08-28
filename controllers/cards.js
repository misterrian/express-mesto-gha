const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');

const DBError = require('../errors/db-error');
const InvalidParametersError = require('../errors/invalid-parameters-error');
const InvalidCardIdError = require('../errors/invalid-card-id-error');
const CardNotFoundError = require('../errors/card-not-found-error');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => {
      throw new DBError();
    });
};

const addCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ owner: req.user._id, name, link })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        throw new InvalidParametersError();
      } else {
        throw new DBError();
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
        throw new InvalidCardIdError();
      } else if (err instanceof DocumentNotFoundError) {
        throw new CardNotFoundError();
      } else {
        throw new DBError();
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
        throw new InvalidCardIdError();
      } else if (err instanceof DocumentNotFoundError) {
        throw new CardNotFoundError();
      } else {
        throw new DBError();
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
        throw new InvalidCardIdError();
      } else if (err instanceof DocumentNotFoundError) {
        throw new CardNotFoundError();
      } else {
        throw new DBError();
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
