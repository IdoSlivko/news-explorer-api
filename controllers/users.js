const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../middleware/errors/badRequestError');
const ConflictError = require('../middleware/errors/conflictError');

// create new user
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      if (!user) {
        throw new Error();
      }
      res.status(201).send({ message: 'User created successfully' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Bad request'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('User already exists'));
      } else {
        next(err);
      }
    });
};

// login
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

// get user info
const userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error();
    })
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => next(err));
};

module.exports = { userInfo, createUser, login };
