const INTERNAL_SERVER_ERROR_CODE = 500;

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
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
};

module.exports = errorHandler;
