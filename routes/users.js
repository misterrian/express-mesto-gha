const express = require('express');

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  updateProfileValidator,
  getUserValidator,
  updateAvatarValidator,
} = require('../middlewares/validators');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserValidator, getUserById);
router.patch('/me', updateProfileValidator, updateProfile);
router.patch('/me/avatar', updateAvatarValidator, updateAvatar);

module.exports = router;
