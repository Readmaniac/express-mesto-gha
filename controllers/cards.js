const Card = require('../models/card');
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER } = require('../errors/errors');

function receiveCards(req, res) {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card
    .create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => (
      err.name === 'ValidationError' ? res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' }) : res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' })
    ));
}

function likeCard(req, res) {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send({ data: card });
      return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' });
    });
}

function dislikeCard(req, res) {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' });
    });
}

function deleteCard(req, res) {
  const { id } = req.params;

  Card
    .findByIdAndRemove(id)
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(ERROR_BAD_REQUEST).send({ message: 'Передан некорректный id' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка на сервере' })
    ));
}

module.exports = {
  receiveCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};
