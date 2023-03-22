const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { registerUser } = require('../controllers/users');
const { regExp } = require('../utils/constants');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi
      .string()
      .pattern(regExp),
  }),
}), registerUser);

module.exports = router;
