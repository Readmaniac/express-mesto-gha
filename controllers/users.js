const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const InaccurateDataError = require('../errors/InaccurateDataError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

function registerUser(req, res, next) {
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такими данными уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  User
    .findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      return new UnauthorizedError('Пользователь не найден');
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.send({ _id: jwt });
    })
    .catch(next);
}

function getUsersInfo(req, res, next) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
}

function getUserInfo(req, res, next) {
  const { id } = req.params;
  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });
      return new NotFoundError('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

function getCurrentUserInfo(req, res, next) {
  User
    .findById(req.user._id)
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new NotFoundError('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

function setUserInfo(req, res, next) {
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
      throw new NotFoundError('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при регистрации пользователя'));
      }
      next(err);
    });
}

function setUserAvatar(req, res, next) {
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
      throw new NotFoundError('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при регистрации пользователя'));
      }
      next(err);
    });
}

module.exports = {
  registerUser,
  getUsersInfo,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  loginUser,
  getCurrentUserInfo,
};
