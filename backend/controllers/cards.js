/* eslint-disable max-len */
const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const OK_CODE = 200;
const CREATED_CODE = 201;

// Получить все карточки
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(OK_CODE).send(cards);
  } catch (err) {
    next(err);
  }
};

// Создать новую карточку
const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(CREATED_CODE).send(card); // карточка успешно создана
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// Удалить карточку
const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    } else if (card.owner.toString() !== owner) {
      // если пользователь не является владельцем текущей карточки
      next(new ForbiddenError('Недостаточно прав для удаления'));
    } else {
      await Card.deleteOne({ _id: cardId });
      res.status(OK_CODE).send(card);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// общая функция для обновления лайков и дизлайков карточки
const updateCardLikes = async (req, res, next, updateOperation) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      updateOperation,
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    } else {
      res.status(OK_CODE).send(card);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// Поставить лайк карточке
const likeCard = async (req, res, next) => updateCardLikes(req, res, next, { $addToSet: { likes: req.user._id } });

// Дислайк карточки
const dislikeCard = async (req, res, next) => updateCardLikes(req, res, next, { $pull: { likes: req.user._id } });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
