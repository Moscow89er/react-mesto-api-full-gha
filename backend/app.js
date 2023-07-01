const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');
const { loginValidation, createUserValidation } = require('./validation/validationRules');
const { errorHandler } = require('./middlewares/errorHandler');

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

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`App listening on port ${PORT}`);
});
