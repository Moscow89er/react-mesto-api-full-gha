const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidation,
  universalCardValidation,
} = require('../validation/validationRules');

router.get('/', getCards);

router.post('/', celebrate(createCardValidation), createCard);

router.delete('/:cardId', celebrate(universalCardValidation), deleteCard);

router.put('/:cardId/likes', celebrate(universalCardValidation), likeCard);

router.delete('/:cardId/likes', celebrate(universalCardValidation), dislikeCard);

module.exports = router;
