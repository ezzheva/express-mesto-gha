const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(auth);

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (_req, res) => res.status(404).json({ message: 'Страница не найдена' }));

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
