const validationError = require('../errors/validationError')

module.exports = (app) => {

  const findAll = (userId) => {
    return app.db('accounts').where({ user_id: userId })
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

    const accountDB = await find({ name: account.name, user_id: account.user_id })

    if (accountDB) {
      throw new validationError('We Found another account with an equal name')
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
