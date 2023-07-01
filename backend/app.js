const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');

const INTERNAL_SERVER_ERROR_CODE = 500;
const urlRegExp = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const { PORT = 3000 } = require('./config/config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// использование кросс-доменных запросов CORS
app.use(cors);

// подключаем логгер запросов
app.use(requestLogger);

// краш тест (к последующему удалению)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты не требующие авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegExp),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

// авторизация
app.use(auth);

// роуты которым авторизация нужна
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// роут если страница не существует
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// обработчик логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = INTERNAL_SERVER_ERROR_CODE, message } = err;
  // eslint-disable-next-line
  console.error(err);
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === INTERNAL_SERVER_ERROR_CODE
        ? 'На сервере произошла ошибка'
        // eslint-disable-next-line
        : message
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`App listening on port ${PORT}`);
});
