const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');

const DBError = require('../errors/db-error');
const InvalidParametersError = require('../errors/invalid-parameters-error');
const InvalidCardIdError = require('../errors/invalid-card-id-error');
const CardNotFoundError = require('../errors/card-not-found-error');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
      next();
    })
    .catch(() => next(new DBError()));
};

const addCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ owner: req.user._id, name, link })
    .then((card) => card.populate('owner'))
    .then((card) => {
      res.send(card);
      next();
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new InvalidParametersError());
      } else {
        next(new DBError());
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findOneAndRemove({ owner: req.user._id, _id: req.params.cardId })
    .populate('owner')
    .orFail()
    .then((card) => {
      res.send(card);
      next();
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new InvalidCardIdError());
      } else if (err instanceof DocumentNotFoundError) {
        next(new CardNotFoundError());
      } else {
        next(new DBError());
      }
    });
};

const addLike = (req, res, next) => {
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
        next(new InvalidCardIdError());
      } else if (err instanceof DocumentNotFoundError) {
        next(new CardNotFoundError());
      } else {
        next(new DBError());
      }
    });
};

const removeLike = (req, res, next) => {
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
        next(new InvalidCardIdError());
      } else if (err instanceof DocumentNotFoundError) {
        next(new CardNotFoundError());
      } else {
        next(new DBError());
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
