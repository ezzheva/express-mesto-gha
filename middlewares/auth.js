// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Beader')) {
    return res.status(401).send({ message: 'Неоходима авторизация' });
  }
  const token = authorization.replace('Beader', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Неоходима авторизация' });
  }
  req.user = payload;
  next();
};
