const express = require('express');

const forbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {

  const router = express.Router();

  router.param('id', (req, res, next) => {
    app.services.transaction.find(req.user.id, { 'transactions.id': req.params.id })
      .then(acc => {
        if (acc.user_id !== req.user.id) {
          throw new forbiddenError()
        } else {
          next()
        }
      }).catch(err => next(err));
  });

  router.get('/', (req, res, next) => {
    app.services.transaction.find(req.user.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const transaction = await app.services.transaction.findOne({ id: req.params.id });
      return res.status(200).json(transaction);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', (req, res, next) => {
    app.services.transaction.save(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.transaction.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err));
  });

  router.delete('/:id', (req, res, next) => {
     app.services.transaction.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  });

  return router;
}
