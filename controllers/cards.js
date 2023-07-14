const Card = require('../models/cards');
const {
  BAD_REQUEST, // 400
  NOT_FOUND_PAGE_CODE, // 404
  SERVER_ERROR, // 500
} = require('../utils/constants');

/** создаем карточку */
module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
    });
};

/** все карточки */
module.exports.getCards = (_req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};

/** удаляем карточку */
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_PAGE_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      } return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
      }
      res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

/** добавляем лайк */
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

/** убираем лайк */
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};
