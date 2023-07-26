// eslint-disable-next-line import/no-extraneous-dependencies
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUserId,
  getUserMe,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required(),
  }),
}), getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(http:\/\/|https:\/\/)(www\.)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/).required(),
  }),
}), updateAvatar);

module.exports = router;
