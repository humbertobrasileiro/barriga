const validationError = require('../errors/validationError');

module.exports = (app) => {

  const find = async (filter = {}) => {
    const result = await app.db('transfers')
      .where(filter)
      .select();
    return result;
  };

  const save = async (transfer) => {
    return await app.db('transfers').insert(transfer, '*');
  };

  return { find, save };
 
}
