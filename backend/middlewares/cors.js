const allowedCors = [
  'https://mesto.moscow89er.frontend.nomoreparties.sbs',
  'http://mesto.moscow89er.frontend.nomoreparties.sbs',
  'localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const NO_CONTENT_STATUS_CODE = 204;

module.exports = (req, res, next) => {
  const { origin, method } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    const requestHeaders = req.headers['access-control-request-headers'];
    if (requestHeaders) {
      res.header('Access-Control-Allow-Headers', requestHeaders);
    }
    return res.status(NO_CONTENT_STATUS_CODE).end();
  }

  return next();
};
