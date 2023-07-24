const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// app.use((req, _res, next) => {
//   req.user = { _id: '64aeb95c3b873d4817a74d6a' };
//   next();
// });

app.use(auth);

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (_req, res) => res.status(404).json({ message: 'Страница не найдена' }));
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
