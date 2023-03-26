const jsonwebtoken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};

module.exports = auth;
