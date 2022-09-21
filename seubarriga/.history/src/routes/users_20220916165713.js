module.exports = (app) => {

  const findAll = (req, res) => {
    app.db('users').select()
      .then(result => res.status(200).json(result))
  }
  
  const create = (req, res) => {
    res.status(201).json(req.body)
  }
   
  return {
    findAll,
    create
  }  
}
