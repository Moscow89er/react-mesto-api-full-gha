const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const { NODE_ENV, JWT_SECRET } = require('../config/config');

const OK_CODE = 200;
const CREATED_CODE = 201;

// Функция для поиска пользователя и обработки ошибок
// eslint-disable-next-line consistent-return
const findUserById = async (id, next) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользоветель не найден');
    }
    return user;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// Общая функция для обновления данных пользователя
const updateUser = async (req, res, next, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );
    res.status(OK_CODE).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// Декоратор для поиска авторизованного пользователя
const findAuthorizedUserDecorator = (controller) => async (req, res, next) => {
  const user = await findUserById(req.user._id, next);
  if (user) {
    req.user = user;
    await controller(req, res, next);
  }
};

// Декоратор для обновления профиля пользователя
const editUser = (req, res, next) => {
  const { name, about } = req.body;
  return updateUser(req, res, next, { name, about });
};

// Декоратор для обновления аватара пользователя
const editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return updateUser(req, res, next, { avatar });
};

// Получить всех пользователей
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(OK_CODE).send(users);
  } catch (err) {
    next(err);
  }
};

// Получить данные пользователя
const getUserData = (req, res) => {
  res.status(OK_CODE).send(req.user);
};

// Создать нового пользователя
const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    // удаляем хэш пароля перед отправкой ответа
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(CREATED_CODE).send(userResponse);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else if (err.code === 11000) {
      next(new ConflictError('Пользователь с этим email уже сущетсвует'));
    } else {
      next(err);
    }
  }
};

// Контроллер аутентификации
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.send({ token, userId: user._id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser: findAuthorizedUserDecorator(getUserData),
  createUser,
  editUser: findAuthorizedUserDecorator(editUser),
  editUserAvatar: findAuthorizedUserDecorator(editUserAvatar),
  login,
  getCurrentUser: findAuthorizedUserDecorator(getUserData),
};
