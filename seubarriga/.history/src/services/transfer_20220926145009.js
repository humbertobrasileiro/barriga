const validationError = require('../errors/validationError');

module.exports = (app) => {

  const find = (filter = {}) => {
    return app.db('transfers')
      .where(filter)
      .select();
  }

  return { find };
 
}
