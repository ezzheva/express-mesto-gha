// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { AuthorizeError } = require('../errors/authorize-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthorizeError('Неоходима авторизация');
  }
  const token = authorization.replace('Beader', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthorizeError('Неоходима авторизация'));
  }
  req.user = payload;
  next();
};
