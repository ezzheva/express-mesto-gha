// eslint-disable-next-line import/no-extraneous-dependencies
const router = require('express').Router();
const {
  getUser,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
