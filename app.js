const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(http:\/\/|https:\/\/)(www\.)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (_req, res) => res.status(404).json({ message: 'Страница не найдена' }));

/** централизованный обработчик ошибок */
app.use(errors()); // обработчик ошибок celebrate
app.use((err, _req, res, next) => {
  /** если у ошибки нет статуса выставляем 500 */
  const { statusCode = 500, massage } = err;
  res.status(statusCode).send({
    /** проверяем статус и выставляемсообщение в зависимости от него */
    message: statusCode === 500
      ? 'Ошибка на сервере'
      : massage,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
