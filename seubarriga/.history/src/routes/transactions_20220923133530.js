const express = require('express');

const forbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {

  const router = express.Router();

  router.param('id', (req, res, next) => {
    console.log(id);
    app.services.transaction.findOne(id)
      .then(trans => {
        console.log(trans);
        if (trans.acc_id !== req.acc_id) {
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

  router.get('/:id', (req, res, next) => {
    app.services.transaction.findOne({ id: req.params.id })
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.post('/', (req, res, next) => {
    app.services.transaction.save(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err));
  });

  return router;
}
