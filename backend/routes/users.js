const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUsers, getUser, editUser, editUserAvatar, getCurrentUser,
} = require('../controllers/users');

const {
  getUserValidation,
  editUserValidation,
  editUserAvatarValidation,
} = require('../validation/validation-rules');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate(getUserValidation), getUser);

router.patch('/me', celebrate(editUserValidation), editUser);

router.patch('/me/avatar', celebrate(editUserAvatarValidation), editUserAvatar);

module.exports = router;
