const express = require('express')

const forbiddenError = require('../errors/forbiddenError')

module.exports = (app) => {

  const router = express.Router()

  router.param('id', async (req, res, next) => {
    await app.services.transaction.find({ id: req.params.id })
      .then(transaction => {
        if (transaction.user_id !== req.user.id) {
          throw new forbiddenError()
        } else {
          next()
        }
      }).catch(err => next(err))
  })

  router.get('/', async (req, res, next) => {
    await app.services.transaction.findAll(req.user.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  })

  router.get('/:id', async (req, res, next) => {
    await app.services.transaction.find({ id: req.params.id })
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  })
  
  router.post('/', async (req, res, next) => {
    const transaction = { ...req.body, user_id: req.user.id }
    await app.services.transaction.save(transaction)
      .then(result => {
        return res.status(201).json(result[0])
      })
      .catch(err => next(err))
  })

  router.put('/:id', async (req, res, next) => {
    await app.services.transaction.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err))
  })

  router.delete('/:id', async (req, res, next) => {
    await app.services.transaction.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err))
  })

  return router
}
