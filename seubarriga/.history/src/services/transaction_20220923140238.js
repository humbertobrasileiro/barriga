const validationError = require('../errors/validationError');

module.exports = (app) => {
 
  const find = (userId, filter = {}) => {
    return app.db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.user_id', '=', userId)
      .select();
  };

  const findOne = (filter) => {
    return app.db('transactions')
      .where(filter)
      .first();
  };

  const save = async (transaction) => {
    const transDB = await find(transaction.userId, { description: transaction.description });

    if (transDB) {
      throw new validationError('We Found another transaction with an equal name');
    }

    return app.db('transactions').insert(transaction, '*');
  };

  return { 
    find, 
    findOne,
    save,
  };
}
