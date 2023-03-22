const jsonwebtoken = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR } = require('../errors/errors');
const { JWT_SECRET } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }

  const jwt = authorization.replace('Bearer ', '');
  try {
    jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    res.status(UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }

  next();
};

module.exports = auth;
