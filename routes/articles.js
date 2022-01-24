const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validateUrlError = require('../middleware/errors/validateUrlError');
const { saveArticle, deleteArticle, showArticle } = require('../controllers/articles');

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().required()
    }),
    keyword: Joi.string().required().max(200),
    title: Joi.string().required().max(200),
    text: Joi.string().required().max(36000),
    date: Joi.string().required().max(100),
    source: Joi.string().required().max(100),
    link: Joi.string().required().custom(validateUrlError),
    image: Joi.string().required().custom(validateUrlError)
  }),
}), saveArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().required()
    })
  }),
  params: Joi.object().keys({
    articleId: Joi.string().hex().required()
  })
}), deleteArticle);

articlesRouter.get('/articles', showArticle);

module.exports = articlesRouter;
