const express = require('express');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
require('dotenv').config();
const limiter = require('./middleware/rate-limiter');
const NotFoundError = require('./middleware/errors/notFoundError');

const app = express();
const { PORT = 3000, NODE_ENV, SERVER_DB } = process.env;

const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const users = require('./routes/users');
const articles = require('./routes/articles');

const invalidResource = (req, res, next) => {
  if (req.url !== '') {
    next(new NotFoundError('Requested resource not found'));
  }
  next();
};

mongoose.connect(NODE_ENV === 'production' ? SERVER_DB : 'mongodb://localhost:27017/news-explorer');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);
app.use(errors());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().normalize().required()
      .max(50),
    password: Joi.string().required().min(3),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signin', login);

app.use(auth);
app.use('/', users);
app.use('/', articles);
app.use(invalidResource);

app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Internal server error' : message,
  });
});

app.listen(PORT);
