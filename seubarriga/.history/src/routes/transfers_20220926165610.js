const express = require('express');

const forbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {

  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const transfer = await app.services.transfer.find({ user_id: req.user.id });
      return res.status(200).json(transfer);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', (req, res, next) => {
    app.services.transfer.save(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err));
  });

  return router;
}
