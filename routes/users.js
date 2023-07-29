const router = require('express').Router();
const { validateUserId, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validation');
const {
  getUser,
  getUserId,
  getUserMe,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/me', getUserMe);
router.get('/:userId', validateUserId, getUserId);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
