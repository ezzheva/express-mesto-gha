const jwt = require('jsonwebtoken');
const AuthorizeError = require('../errors/AuthorizeError');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, _res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new AuthorizeError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthorizeError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
