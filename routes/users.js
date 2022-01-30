const usersRouter = require('express').Router();
const { userInfo } = require('../controllers/users');

usersRouter.get('/users/me', userInfo);

module.exports = usersRouter;
