const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const { loginValidation, createUserValidation } = require('./validation/validationRules');

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

// роуты не требующие авторизации
app.post('/signin', celebrate(loginValidation), login);

app.post('/signup', celebrate(createUserValidation), createUser);

// авторизация
app.use(auth);

// используем централизованный роутер
app.use('/', require('./routes'));

// роут если страница не существует
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// обработчик логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// центральный обработчки ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`App listening on port ${PORT}`);
});
