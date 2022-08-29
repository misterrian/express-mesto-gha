const {
  DocumentNotFoundError,
  ValidationError,
  CastError,
} = require('mongoose').Error;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { celebrate, Joi } = require('celebrate');

const User = require('../models/user');

const InvalidParametersError = require('../errors/invalid-parameters-error');
const DBError = require('../errors/db-error');
const UserIsNotAuthorizedError = require('../errors/user-not-authorized-error');
const InvalidUserIdError = require('../errors/invalid-user-id-error');
const UserNotFoundError = require('../errors/user-not-found-error');
const UserAlreadyExistsError = require('../errors/user-already-exists-error');
const InvalidUserOrPasswordError = require('../errors/invalid-user-or-password-error');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3800000 * 7 * 24,
          httpOnly: true,
        })
        .send({ message: 'OK' });
    })
    .catch(() => next(new InvalidUserOrPasswordError()));
};

const loginValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send(user.toObject({ useProjection: true })))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new InvalidParametersError());
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new UserAlreadyExistsError());
      } else {
        next(new DBError());
      }
    });
};

const createUserValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/),
    }),
});

function loadUserFromDb(userId, res, next) {
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new InvalidUserIdError());
      } else if (err instanceof DocumentNotFoundError) {
        next(new UserNotFoundError());
      } else {
        next(new DBError());
      }
    });
}

const getCurrentUser = (req, res, next) => {
  if (req.user) {
    loadUserFromDb(req.user._id, res, next);
  } else {
    next(new UserIsNotAuthorizedError());
  }
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(DBError()));
};

const getUserById = (req, res, next) => {
  loadUserFromDb(req.params.userId, res, next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new InvalidParametersError());
      } else if (err instanceof DocumentNotFoundError) {
        next(new UserNotFoundError());
      } else {
        next(new DBError());
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new UserNotFoundError());
      } else {
        next(new DBError());
      }
    });
};

module.exports = {
  login,
  loginValidator,
  createUser,
  createUserValidator,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};
