const validationError = require('../errors/validationError');

module.exports = (app) => {
 
  const find = (userId, filter = {}) => {
    return app.db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.user_id', '=', userId)
      .select();
  };

  const findOne = async (filter) => {
    const transaction = await app.db('transactions')
      .where(filter)
      .first();
    return transaction;
  };

  const save = async (transaction) => {
    const transDB = await find(transaction.acc_id, { description: transaction.description });

    if (transDB && transDB.length > 0 ) {
      throw new validationError('We Found another transaction with an equal name');
    }

    return app.db('transactions').insert(transaction, '*');
  };

  const update = async (id, transaction) => {
    return await app.db('transactions').where({ id }).update(transaction, '*');
  };

  return { 
    find, 
    findOne,
    save,
    update,
  };
}
