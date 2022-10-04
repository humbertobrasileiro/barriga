const validationError = require('../errors/validationError');

module.exports = (app) => {

  const find = async (filter = {}) => {
    const result = await app.db('transfers')
      .where(filter)
      .select();
    return result;
  };
 
  const findOne = async (filter) => {
    const transfer = await app.db('transfers')
      .where(filter)
      .first();
    return transfer;
  };

  const validate = async (transfer) => {

    if (!transfer.description) throw new validationError('The description is a required attribute')
    if (!transfer.ammount) throw new validationError('The ammount is a required attribute')
    if (!transfer.date) throw new validationError('The date is a required attribute')
    if (!transfer.acc_ori_id) throw new validationError('The originating account is a required attribute')
    if (!transfer.acc_des_id) throw new validationError('The destination account is a required attribute')
    if (transfer.acc_ori_id === transfer.acc_des_id) throw new validationError('The account origin and destiny cannot equal')

    const accounts = await app.db('accounts')
      .whereIn('id', [transfer.acc_ori_id, transfer.acc_des_id])
      .select();

    accounts.forEach(acc => {
      if (acc.user_id !== parseInt(transfer.user_id, 10)) throw new validationError('Accounts belong to another user');
    }); 
    
  };

  const save = async (transfer) => {

    const result = await app.db('transfers').insert(transfer, '*');

    const transferId = result[0].id;

    console.log(transferId);

    const transactions = [
      { 
        description: `Transfer to acc #${transfer.acc_des_id}`, 
        date: transfer.date,
        ammount: transfer.ammount * -1,
        type: 'O',
        acc_id: transfer.acc_ori_id,
        transfer_id: transferId,
        status: true
      },
      { 
        description: `Transfer from acc #${transfer.acc_ori_id}`, 
        date: transfer.date,
        ammount: transfer.ammount,
        type: 'I',
        acc_id: transfer.acc_des_id,
        transfer_id: transferId,
        status: true
      }
    ];

    await app.db('transactions').insert(transactions);
  
    return result;
  };

  const update = async (id, transfer) => {
    const result = await app.db('transfers')
      .where({ id })
      .update(transfer, '*');

    const transactions = [
      { 
        description: `Transfer to acc #${transfer.acc_des_id}`, 
        date: transfer.date,
        ammount: transfer.ammount * -1,
        type: 'O',
        acc_id: transfer.acc_ori_id,
        transfer_id: id,
        status: true
      },
      { 
        description: `Transfer from acc #${transfer.acc_ori_id}`, 
        date: transfer.date,
        ammount: transfer.ammount,
        type: 'I',
        acc_id: transfer.acc_des_id,
        transfer_id: id,
        status: true
      }
    ];

    await app.db('transactions')
      .where({ transfer_id: id })
      .del();

    await app.db('transactions').insert(transactions);
  
    return await app.db('transfers').where({ id }).update(transfer, '*');
    
  };

  const remove = async (id) => {

    await app.db('transactions').where({ transfer_id: id }).del();

    return await app.db('transfers').where({ id }).del();
  };

  return { find, findOne, validate, save, update, remove };
 
}
