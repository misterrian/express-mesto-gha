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
  .post('/me', updateProfile)
  .post('/me/avatar', updateAvatar);
