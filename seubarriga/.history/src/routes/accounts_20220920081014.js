module.exports = (app) => {

  const findAll = (req, res) => {
    app.services.account.findAll()
      .then(result => res.status(200).json(result))
  }

  const get = (req, res) => {
    app.services.account.find({ id: req.params.id })
      .then(result => res.status(200).json(result))
  }
  
  const create = async (req, res, next) => {
    try {
      const result = await app.services.account.save(req.body)
      return res.status(201).json(result[0])
    } catch(err => next(err))
  }

  const update = async (req, res) => {
    await app.services.account.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
  }

  const remove = async (req, res) => {
    await app.services.account.remove(req.params.id)
      .then(() => res.status(204).send())
  }
   
  return {
    findAll,
    get,
    create,
    update,
    remove,
  }  
}
