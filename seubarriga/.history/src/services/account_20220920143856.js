const validationError = require('../errors/validationError')

module.exports = (app) => {

  const findAll = () => {
    return app.db('accounts')
  }
  
  const find = (filter = {}) => {
    return app.db('accounts').where(filter).first()
  }

  const save = async (account) => {
    if (!account.name) {
      throw new validationError('The name is a required attribute')
    }
    if (!account.user_id) {
      throw new validationError('The user id is a required attribute')
    }
    return await app.db('accounts').insert(account, '*')
  }

  const update = async (id, account) => {
    return await app.db('accounts').where({ id }).update(account, '*')
  }

  const remove = async (id) => {
    return await app.db('accounts').where({ id }).del()
  }

  return { 
    findAll, 
    find, 
    save, 
    update,
    remove,
  }
}
