const Card = require('../models/card');
const ConflictError = require('../errors/ConflictError');
const InaccurateDataError = require('../errors/InaccurateDataError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const {
  ERROR_BAD_REQUEST,
  FORBIDDEN_ERROR,
} = require('../errors/errors');

function receiveCards(req, res, next) {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card
    .create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
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
      return new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
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
      return new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new InaccurateDataError('Переданы некорректные данные для снятия лайка');
      if (!card.owner.equals(req.user._id)) res.status(FORBIDDEN_ERROR).send({ message: 'Нет прав на удаление карточки' });
      card
        .remove()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  receiveCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};
