require('dotenv').config();

const { NODE_ENV = 'development', JWT_SECRET = 'my-secret-key' } = process.env;

module.exports = {
  NODE_ENV,
  JWT_SECRET,
};
