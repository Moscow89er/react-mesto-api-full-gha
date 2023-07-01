const { Joi } = require('celebrate');

const urlRegExp = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const createCardValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlRegExp).required(),
  }),
};

const universalCardValidation = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

const getUserValidation = {
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
};

const editUserValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
};

const editUserAvatarValidation = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegExp).required(),
  }),
};

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const createUserValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegExp),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

module.exports = {
  createCardValidation,
  universalCardValidation,
  getUserValidation,
  editUserValidation,
  editUserAvatarValidation,
  loginValidation,
  createUserValidation,
};
