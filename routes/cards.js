const express = require('express');

const {
  getCards,
  addCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

module.exports = express.Router()
  .get('/', getCards)
  .post('/', addCard)
  .delete('/:cardId', deleteCard)
  .put('/:cardId/likes', addLike)
  .delete('/:cardId/likes', removeLike);
