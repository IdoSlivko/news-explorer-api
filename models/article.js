const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    maxlength: 200,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  text: {
    type: String,
    required: true,
    unique: true,
    maxlength: 36000,
  },
  date: {
    type: String,
    required: true,
    maxlength: 100,
  },
  source: {
    type: String,
    required: true,
    maxlength: 100,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'Invalid link',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'Invalid link',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
