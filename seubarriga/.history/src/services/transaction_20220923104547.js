const validationError = require('../errors/validationError');

module.exports = (app) => {
 
  const find = (userId, filter = {}) => {
    return app.db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.user_id', '=', userId)
      .select();
  };

  const save = async (transaction) => {
    if (!transaction.description) {
      throw new validationError('The description is a required attribute')
    }
    if (!transaction.acc_id) {
      throw new validationError('The account id is a required attribute')
    }

    const transDB = await find({ description: transaction.description, acc_id: transaction.acc_id });

    if (transDB) {
      throw new validationError('We Found another transaction with an equal name');
    }

    return await app.db('transactions').insert(transaction, '*');
  };

  return { 
    find, 
    save,
  };
}
