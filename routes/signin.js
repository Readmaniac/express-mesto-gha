const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { loginUser } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), loginUser);

module.exports = router;
