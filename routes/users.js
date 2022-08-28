const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object()
      .keys({
        userId: Joi.number()
          .integer()
          .required(),
      }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string()
          .required()
          .min(2)
          .max(30),
        about: Joi.string()
          .required()
          .min(2)
          .max(30),
      }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi
          .string()
          .required()
          .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/),
      }),
  }),
  updateAvatar,
);

module.exports = router;
