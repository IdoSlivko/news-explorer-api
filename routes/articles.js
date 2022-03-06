const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validateUrlError = require('../middleware/errors/validateUrlError');
const { saveArticle, deleteArticle, showArticle } = require('../controllers/articles');

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().required(),
    }),
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateUrlError),
    image: Joi.string().required().custom(validateUrlError),
  }),
}), saveArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().required(),
    }),
  }),
  params: Joi.object().keys({
    articleId: Joi.string().hex().required(),
  }),
}), deleteArticle);

articlesRouter.get('/articles', showArticle);

module.exports = articlesRouter;
