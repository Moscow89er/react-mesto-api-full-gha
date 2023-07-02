const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const OK_CODE = 200;
const CREATED_CODE = 201;

// функция для поиска карточки и обработки ошибок
// eslint-disable-next-line consistent-return
const findCardById = async (id, next) => {
  try {
    const card = await Card.findById(id);
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return card;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// декоратор для поиска карточки по Id
const findCardByIdDecorator = (controller) => async (req, res, next) => {
  const card = await findCardById(req.params.cardId, next);
  if (card) {
    req.card = card;
    await controller(req, res, next);
  }
};

// декоратор для проверки принадлежности карточки к пользователю
const checkCardOwnershipDecorator = (controller) => async (req, res, next) => {
  const { card, user } = req;
  if (card.owner.toString() !== user._id) {
    next(new ForbiddenError('Недостаточно прав для выполнения операции'));
  } else {
    await controller(req, res, next);
  }
};

// декоратор для обновления лайков
const updateCardLikesDecorator = (updateOperation) => async (req, res, next) => {
  const { card } = req;
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      card._id,
      updateOperation({ userId: req.user._id }),
      { new: true },
    );
    res.status(OK_CODE).send(updatedCard);
  } catch (err) {
    next(err);
  }
};

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
  const { card } = req;
  try {
    await Card.deleteOne({ _id: card._id });
    res.status(OK_CODE).send(card);
  } catch (err) {
    next(err);
  }
};

// Поставить лайк карточке
const likeCard = updateCardLikesDecorator(({ userId }) => ({ $addToSet: { likes: userId } }));

// Дислайк карточки
const dislikeCard = updateCardLikesDecorator(({ userId }) => ({ $pull: { likes: userId } }));

module.exports = {
  getCards,
  createCard,
  deleteCard: findCardByIdDecorator(checkCardOwnershipDecorator(deleteCard)),
  likeCard: findCardByIdDecorator(likeCard),
  dislikeCard: findCardByIdDecorator(dislikeCard),
};
