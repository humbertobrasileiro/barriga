module.exports = (app) => {

  const findAll = (req, res) => {
    app.services.account.findAll()
      .then(result => res.status(200).json(result))
  }

  const get = (req, res) => {
    app.services.account.find({ id: req.params.id })
      .then(result => res.status(200).json(result))
  }
  
  const create = async (req, res) => {
    const result = await app.services.account.save(req.body)
    if (result.error) return res.status(400).json(result)
    return res.status(201).json(result[0])
  }

  const update = async (req, res) => {
    const result = await app.services.account.update(req.body)
    return res.status(200).json(result)
  }
   
  return {
    findAll,
    get,
    create,
    update
  }  
}