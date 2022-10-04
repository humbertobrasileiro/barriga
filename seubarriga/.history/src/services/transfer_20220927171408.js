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

    const accOri = await app.services.account.find({ id: transfer.acc_ori_id });
    const accDes = await app.services.account.find({ id: transfer.acc_des_id });

    if ((accOri.user_id !== transfer.user_id) 
      || (accDes.user_id !== transfer.user_id)) 
      throw new validationError('Accounts belong to another user');
    
  }

  const save = async (transfer) => {

    await validate(transfer);

    const result = await app.db('transfers').insert(transfer, '*');

    const transferId = result[0].id;

    const transactions = [
      { 
        description: `Transfer to acc #${transfer.acc_des_id}`, 
        date: transfer.date,
        ammount: transfer.ammount * -1,
        type: 'O',
        acc_id: transfer.acc_ori_id,
        transfer_id: transferId
      },
      { 
        description: `Transfer from acc #${transfer.acc_ori_id}`, 
        date: transfer.date,
        ammount: transfer.ammount,
        type: 'I',
        acc_id: transfer.acc_des_id,
        transfer_id: transferId
      }
    ];

    await app.db('transactions').insert(transactions);
  
    return result;
  };

  const update = async (id, transfer) => {
    const result = await app.db('transfers')
      .where({ id })
      .update(transfer, '*');

    await validate(transfer);
    console.log(' t ', transfer);

    const transactions = [
      { 
        description: `Transfer to acc #${transfer.acc_des_id}`, 
        date: transfer.date,
        ammount: transfer.ammount * -1,
        type: 'O',
        acc_id: transfer.acc_ori_id,
        transfer_id: id
      },
      { 
        description: `Transfer from acc #${transfer.acc_ori_id}`, 
        date: transfer.date,
        ammount: transfer.ammount,
        type: 'I',
        acc_id: transfer.acc_des_id,
        transfer_id: id
      }
    ];

    await app.db('transactions')
      .where({ transfer_id: id })
      .del();

    const data = await app.db('transfers').where({ id }).update(transfer, '*');
    
    await app.db('transactions').insert(transactions);
  
    return data;
  };

  return { find, findOne, validate, save, update };
 
}
