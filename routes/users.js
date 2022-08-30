const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const { linkRegExp } = require('../utils/utils');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object()
      .keys({
        userId: Joi
          .string()
          .required()
          .hex()
          .length(24),
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
          .pattern(linkRegExp),
      }),
  }),
  updateAvatar,
);

module.exports = router;
