const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

const User = require('../models/user');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  CONFLICT_REQUEST,
  UNAUTHORIZED_ERROR,
} = require('../errors/errors');

function createUser(req, res, next) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(CONFLICT_REQUEST).send({ message: 'Пользователь с такими данными уже существует' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  User
    .findUser(email, password)
    .orFail(() => res.status(UNAUTHORIZED_ERROR).send({ message: 'Пользователь не найден' }))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      return res.status(UNAUTHORIZED_ERROR).send({ message: 'Пользователь не найден' });
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ _id: jwt });
    })
    .catch(next);
}

function getUsersInfo(req, res) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' }));
}

function getUserInfo(req, res) {
  const { id } = req.params;
  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => (
      err.name === 'CastError' ? res.status(ERROR_BAD_REQUEST).send({ message: 'Передан некорректный id' }) : res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' })
    ));
}

function setUserInfo(req, res) {
  const { name, about } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(
      userId,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' });
    });
}

function setUserAvatar(req, res) {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' });
    });
}

module.exports = {
  createUser,
  getUsersInfo,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
};
