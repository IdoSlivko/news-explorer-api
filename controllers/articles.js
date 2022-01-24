const Article = require('../models/article');

const BadRequestError = require('../middleware/errors/badRequestError');
const ConflictError = require('../middleware/errors/conflictError');
const NotFoundError = require('../middleware/errors/notFoundError');

// save an article to the user account
const saveArticle = (req, res, next) => {
  const owner = req.user._id;
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner
  })
  .then((article) => {
    if (!article) { throw new Error(); }
    res.status(201).send({ message: 'Article was saved' });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Bad request'));
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('This article is already exists in the account'));
    } else {
      next(err);
    }
  });
};

// delete an article from the user's account
const deleteArticle = (req, res, next) => {

  Article.findById(req.params.articleId).select('owner')
  .then((article) => {
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    if (!article.owner.equals(req.user._id)) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }
    Article.deleteOne(article)
    .then(() => res.send({ message: 'Article has been deleted' }))
  })
  .catch(err => next(err));
};

// get user's saved articles
const showArticle = (req, res, next) => {

  Article.find({ owner: req.user._id })
  .then((article) => {
    if (article.length === 0) {
      throw new NotFoundError('There are no saved articles');
    }
    res.send(article);
  })
  .catch(err => next(err));
};

module.exports = { showArticle, saveArticle, deleteArticle };
