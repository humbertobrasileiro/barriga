const express = require('express');

const forbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {

  const router = express.Router();

  router.param('id', (req, res, next) => {
    app.services.transfer.findOne({ id: req.params.id })
      .then(transfer => {
        if (transfer.id !== req.user.id) {
          throw new forbiddenError()
        } else {
          next()
        }
      }).catch(err => next(err));
  });

  const validate = (req, res, next) => {
    app.services.transfer.validate(req.body)
      .then(() => next())
      .catch(err => next(err));
  }

  router.get('/', async (req, res, next) => {
    try {
      const transfer = await app.services.transfer.find({ id: req.user.id });
      return res.status(200).json(transfer);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', (req, res, next) => {
    app.services.transfer.findOne({ id: req.params.id })
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.post('/', validate, (req, res, next) => {
    console.log(req.body);
    app.services.transfer.save(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err));
  });

  router.put('/:id', validate, (req, res, next) => {
    app.services.transfer.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.transfer.remove(req.params.id)
     .then(() => res.status(204).send())
     .catch(err => next(err));
 });

  return router;
}
