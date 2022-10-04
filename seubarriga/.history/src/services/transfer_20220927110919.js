const validationError = require('../errors/validationError');

module.exports = (app) => {

  const find = async (filter = {}) => {
    const result = await app.db('transfers')
      .where(filter)
      .select();
    return result;
  };

  const save = async (transfer) => {

    if (!transfer.description) throw new validationError('The description is a required attribute')
    if (!transfer.ammount) throw new validationError('The ammount is a required attribute')
    if (!transfer.date) throw new validationError('The date is a required attribute')
    if (!transfer.acc_ori_id) throw new validationError('The originating account is a required attribute')
    if (!transfer.acc_des_id) throw new validationError('The destination account is a required attribute')
  //  if (!transfer.type) throw new validationError('The type is a required attribute')

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

  return { find, save };
 
}
