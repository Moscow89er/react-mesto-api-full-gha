const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const card = mongoose.model('card', cardSchema);

module.exports = card;
