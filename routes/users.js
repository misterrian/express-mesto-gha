const express = require('express');

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

module.exports = express.Router()
  .get('/', getAllUsers)
  .get('/me', getCurrentUser)
  .get('/:userId', getUserById)
  .patch('/me', updateProfile)
  .patch('/me/avatar', updateAvatar);
