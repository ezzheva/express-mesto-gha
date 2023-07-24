// eslint-disable-next-line import/no-extraneous-dependencies
const router = require('express').Router();
const {
  getUser,
  getUserId,
  getUserMe,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserId);
router.get('/me', getUserMe);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
