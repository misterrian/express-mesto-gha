const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { linkRegExp } = require('../utils/utils');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Почта пользователя указана с ошибками',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return v.match(linkRegExp);
      },
      message: 'Некорректная ссылка на аватар пользователя',
    },
  },
}, {
  versionKey: false,
  validateBeforeSave: true,
});

function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) {
              return user;
            }
            return Promise.reject(new UnauthorizedError('Некорректный пользователь или пароль'));
          });
      }
      return Promise.reject(new UnauthorizedError('Некорректный пользователь или пароль'));
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('user', userSchema);
