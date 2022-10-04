const validationError = require('../errors/validationError');

module.exports = (app) => {
 
  const find = async (userId, filter = {}) => {
    const result = await app.db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.user_id', '=', userId)
      .select();
    return result;
  };

  const findOne = async (filter) => {
    const transaction = await app.db('transactions')
      .where(filter)
      .first();
    return transaction;
  };

  const save = async (transaction) => {

    if (!transaction.description) throw new validationError('The description is a riquered attribute')
    if (!transaction.ammount) throw new validationError('The ammount is a riquered attribute')
    if (!transaction.date) throw new validationError('The date is a riquered attribute')
    
    if ((transaction.type === 'I' && transaction.ammount < 0) 
      || (transaction.type === 'O' && transaction.ammount > 0)) {
        transaction.ammount *= -1;
    }

    const transDB = await find(transaction.acc_id, { description: transaction.description });

    if (transDB && transDB.length > 0 ) {
      throw new validationError('We Found another transaction with an equal name');
    }

    return app.db('transactions').insert(transaction, '*');
  };

  const update = async (id, transaction) => {
    return await app.db('transactions').where({ id }).update(transaction, '*');
  };

  const remove = async (id) => {
    return await app.db('transactions').where({ id }).del();
  };

  return { 
    find, 
    findOne,
    save,
    update,
    remove,
  };
}
