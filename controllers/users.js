const User = require('../models/user');
const {
  BAD_REQUEST, // 400
  NOT_FOUND_PAGE_CODE, // 404
  SERVER_ERROR, // 500
} = require('../utils/constants');

/** все пользователи */
module.exports.getUser = (_req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};

/** ишем пользователя по Id */
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передача некорректных данных пользователя' });
      }
      return res.status(NOT_FOUND_PAGE_CODE).send({ message: 'пользователь с указаным _id не найден' });
    });
};

/** создание пользователя */
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

/** обновляем данные */
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_CODE).send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

/** обновляем аватар */
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_CODE).send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};
