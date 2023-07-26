const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

/** все пользователи */
module.exports.getUser = (_req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

/** ишем пользователя по Id */
exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректные данные пользователя'));
      }
      if (err.name === 'DocumentNotFound') {
        return next(new NotFoundError('Пользователь c указанным _id не найден'));
      }
      return next(err);
    });
};

/** создание пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send(
      {
        data: {
          name, about, avatar, email,
        },
      },
    ))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные пользователя'));
      }
      return next(err);
    });
};

/** обновляем данные */
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные пользователя'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с указаным _id не найден'));
      }
      return next(err);
    });
};

/** обновляем аватар */
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные пользователя'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(err);
    });
};

/** текущий пользователь */
module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
  // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные пользователя'));
      }
      if (err.name === 'DocumentNotFound') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(err);
    });
};
