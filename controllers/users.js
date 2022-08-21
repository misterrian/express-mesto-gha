const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const { sendMessage } = require('../utils/utils');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => sendMessage(res, 500, 'Произошла ошибка'));
};

const getUserById = (req, res) => {
  const userId = req.params.userId;

  if (!ObjectId.isValid(userId)) {
    sendMessage(res, 400, 'Не корректный id пользователя');
    return;
  }

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        sendMessage(res, 404, 'Запрашиваемый пользователь не найден');
      } else {
        sendMessage(res, 500, 'Произошла ошибка');
      }
    });
};

const addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      if (err instanceof ValidationError) {
        sendMessage(res, 400, 'Переданы некорректные данные');
      } else {
        sendMessage(res, 500, 'Произошла ошибка');
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
        sendMessage(res, 400, 'Переданы некорректные данные');
      } else if (err instanceof DocumentNotFoundError) {
        sendMessage(res, 404, 'Запрашиваемый пользователь не найден');
      } else {
        sendMessage(res, 500, 'Произошла ошибка');
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
        sendMessage(res, 404, 'Запрашиваемый пользователь не найден');
      } else {
        sendMessage(res, 500, 'Произошла ошибка');
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
