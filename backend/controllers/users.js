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

// Получить всех пользователей
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(OK_CODE).send(users);
  } catch (err) {
    next(err);
  }
};

// Получить пользователя по id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользоветель не найден');
    } else {
      res.status(OK_CODE).send(user);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// Получить информацию о текущем пользователе
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Текущий пользоветель не найден');
    } else {
      res.status(OK_CODE).send(user);
    }
  } catch (err) {
    next(err);
  }
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

// Обновление профиля
const editUser = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
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

// Обновленее аватара
const editUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUser,
  editUserAvatar,
  login,
  getCurrentUser,
};
