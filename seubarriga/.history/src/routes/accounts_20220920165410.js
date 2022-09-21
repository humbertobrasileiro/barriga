const express = require('express')

module.exports = (app) => {

  const router = express.Router()

  router.get('/', async (req, res, next) => {
    await app.services.account.findAll(req.user.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  })

  router.get('/:id', async (req, res, next) => {
    await app.services.account.find({ id: req.params.id })
      .then(result => {
        if (result.user_id !== releaseEvents.user.id) {
          return res.status(403).json({ error: 'Este' })
        } else {
          return es.status(200).json(result)
        }
      })
      .catch(err => next(err))
  })
  
  router.post('/', async (req, res, next) => {
    const account = { ...req.body, user_id: req.user.id }
    await app.services.account.save(account)
      .then(result => {
        return res.status(201).json(result[0])
      })
      .catch(err => next(err))
  })

  router.put('/:id', async (req, res, next) => {
    await app.services.account.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err))
  })

  router.delete('/:id', async (req, res, next) => {
    await app.services.account.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err))
  })
   
  return router
}
