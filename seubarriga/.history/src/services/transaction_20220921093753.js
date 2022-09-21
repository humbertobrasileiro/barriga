const validationError = require('../errors/validationError')

module.exports = (app) => {

  return { 
    findAll, 
    find, 
    save, 
    update,
    remove,
  }
}
