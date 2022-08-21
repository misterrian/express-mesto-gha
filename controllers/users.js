const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const { sendMessage } = require('../utils/utils');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => sendMessage(res, 500, 'Произошла ошибка'));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
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

  if (Object.keys(req.body).length > 3) {
    sendMessage(res, 400, 'Переданы лишние параметры');
  } else if (!name) {
    sendMessage(res, 400, 'Не указано имя пользователя');
  } else if (!about) {
    sendMessage(res, 400, 'Не указано описание пользователя');
  } else if (!avatar) {
    sendMessage(res, 400, 'Не указан аватар пользователя');
  } else {
    User.create({ name, about, avatar }, { validateBeforeSave: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err instanceof ValidationError) {
          sendMessage(res, 400, 'Переданы некорректные данные');
        } else {
          sendMessage(res, 500, 'Произошла ошибка');
        }
      });
  }
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  if (Object.keys(req.body).length > 2) {
    sendMessage(res, 400, 'Переданы лишние параметры');
  } else if (!name) {
    sendMessage(res, 400, 'Не указано имя пользователя');
  } else if (!about) {
    sendMessage(res, 400, 'Не указано описание пользователя');
  } else {
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
  }
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (Object.keys(req.body).length > 1) {
    sendMessage(res, 400, 'Переданы лишние параметры');
  } else if (!avatar) {
    sendMessage(res, 400, 'Не указан аватар пользователя');
  } else {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
      .orFail()
      .then((user) => res.send(user))
      .catch((err) => {
        if (err instanceof DocumentNotFoundError) {
          sendMessage(res, 404, 'Запрашиваемый пользователь не найден');
        } else {
          sendMessage(res, 500, 'Произошла ошибка');
        }
      });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateProfile,
  updateAvatar,
};
