const express = require('express');

const forbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {

  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const transfer = await app.services.transfer.find({ user_id: req.user.id });
      console.log(transfer);
      return res.status(200).json(transfer);
    } catch (err) {
      next(err);
    }
  })

  return router;
}
