const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError, BadRequest, ConflictError } = require('../errors/errors');

/** все пользователи */
module.exports.getUser = (_req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

/** ишем пользователя по Id */
exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new NotFoundError('Пользователь c указанным _id не найден'); })
    .then((user) => {
      res.send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return (next(new BadRequest('Некорректные данные пользователя')));
      }
    });
};

/** создание пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new BadRequest('Некорректные данные пользователя'));
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

/** обновляем данные */
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFaiil(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => {
      res.send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // eslint-disable-next-line no-undef
        next(new BadRequest('Некорректные данные пользователя'));
      }
    });
};

/** обновляем аватар */
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFaiil(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные пользователя'));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
    })
    .catch(next);
};

/** текущий пользователь */
module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь c указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};
