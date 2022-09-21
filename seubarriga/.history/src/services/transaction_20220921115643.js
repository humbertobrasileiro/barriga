const validationError = require('../errors/validationError')

module.exports = (app) => {
 
  const find = (userId, filter = {}) => {
    return app.db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.user_id', '=', userId)
      .select()
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

    return await app.db('transactions').insert(transaction, '*')
  }

  const update = async (id, transaction) => {
    return await app.db('transactions').where({ id }).update(transaction, '*')
  }

  const remove = async (id) => {
    return await app.db('transactions').where({ id }).del()
  }

  return { 
    find, 
    save, 
    update,
    remove,
  }
}
