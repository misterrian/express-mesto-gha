const {
  DocumentNotFoundError,
  ValidationError,
  CastError,
} = require('mongoose').Error;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const InternalServerError = require('../errors/internal-server-error');

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
    .catch(() => next(new UnauthorizedError('Некорректный пользователь или пароль')));
};

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
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с указанным email уже существует'));
      } else {
        next(new InternalServerError('Произошла ошибка'));
      }
    });
};

const signout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'OK' });
};

function loadUserFromDb(userId, res, next) {
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный id пользователя'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(new InternalServerError('Произошла ошибка'));
      }
    });
}

const getCurrentUser = (req, res, next) => {
  if (req.user) {
    loadUserFromDb(req.user._id, res, next);
  } else {
    next(new UnauthorizedError('Пользователь не авторизован'));
  }
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(InternalServerError('Произошла ошибка')));
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
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(new InternalServerError('Произошла ошибка'));
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
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(new InternalServerError('Произошла ошибка'));
      }
    });
};

module.exports = {
  login,
  createUser,
  signout,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};
