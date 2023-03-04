const User = require('../models/user');


function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
        : res.status(500).send({ message: 'Ошибка на сервере' })
    ));
}

function getUsersInfo(req, res) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
}

function getUserInfo(req, res) {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(400).send({ message: 'Передан некорректный id' })
        : res.status(500).send({ message: 'Ошибка на сервере' })
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

      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
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
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
}

module.exports = {
  createUser,
  getUsersInfo,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
};
