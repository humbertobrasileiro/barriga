const validationError = require('../errors/validationError')

module.exports = (app) => {

  const findAll = (userId) => {
    return app.db('transaction').where({ user_id: userId })
  }
  
  const find = (filter = {}) => {
    return app.db('transaction').where(filter).first()
  }

  const save = async (transaction) => {
    if (!transaction.name) {
      throw new validationError('The name is a required attribute')
    }
    if (!transaction.user_id) {
      throw new validationError('The user id is a required attribute')
    }

    const transactionDB = await find({ name: transaction.name, user_id: transaction.user_id })

    if (transactionDB) {
      throw new validationError('We Found another transaction with an equal name')
    }

    return await app.db('transaction').insert(transaction, '*')
  }

  const update = async (id, transaction) => {
    return await app.db('transaction').where({ id }).update(transaction, '*')
  }

  const remove = async (id) => {
    return await app.db('transaction').where({ id }).del()
  }

  return { 
    findAll, 
    find, 
    save, 
    update,
    remove,
  }
}
