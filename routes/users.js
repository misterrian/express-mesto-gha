const express = require('express');

const {
  getAllUsers,
  getUserById,
  addUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

module.exports = express.Router()
  .get('/', getAllUsers)
  .get('/:userId', getUserById)
  .post('/', addUser)
  .patch('/me', updateProfile)
  .patch('/me/avatar', updateAvatar);
