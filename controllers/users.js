const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');
const { sendMessage } = require('../utils/utils');

const {
  DB_ERROR,
  INVALID_USER_ID,
  USER_NOT_FOUND,
  INVALID_PARAMETERS,
} = require('../utils/errors');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => sendMessage(res, DB_ERROR, 'Произошла ошибка'));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        sendMessage(res, INVALID_USER_ID, 'Не корректный id пользователя');
      } else if (err instanceof DocumentNotFoundError) {
        sendMessage(res, USER_NOT_FOUND, 'Запрашиваемый пользователь не найден');
      } else {
        sendMessage(res, DB_ERROR, 'Произошла ошибка');
      }
    });
};

const addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        sendMessage(res, INVALID_PARAMETERS, 'Переданы некорректные данные');
      } else {
        sendMessage(res, DB_ERROR, 'Произошла ошибка');
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        sendMessage(res, INVALID_PARAMETERS, 'Переданы некорректные данные');
      } else if (err instanceof DocumentNotFoundError) {
        sendMessage(res, USER_NOT_FOUND, 'Запрашиваемый пользователь не найден');
      } else {
        sendMessage(res, DB_ERROR, 'Произошла ошибка');
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        sendMessage(res, USER_NOT_FOUND, 'Запрашиваемый пользователь не найден');
      } else {
        sendMessage(res, DB_ERROR, 'Произошла ошибка');
      }
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateProfile,
  updateAvatar,
};
