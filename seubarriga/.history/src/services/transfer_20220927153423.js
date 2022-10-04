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

  const validation = async (transfer) => {

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

    validation(transfer);

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

    let date;
    let tAmmount;
    let acc_ori_id;
    let acc_des_id;

    if (transfer.date === undefined) date = result[0].date; else date = transfer.date;
    if (transfer.ammount === undefined) tAmmount = result[0].ammount; else tAmmount = transfer.ammount;
    if (transfer.acc_ori_id === undefined) acc_ori_id = result[0].acc_ori_id; else acc_ori_id = transfer.acc_ori_id;
    if (transfer.acc_des_id === undefined) acc_des_id = result[0].acc_des_id; else acc_des_id = transfer.acc_des_id;

    const transactions = [
      { 
        description: `Transfer to acc #${acc_des_id}`, 
        date,
        ammount: tAmmount * -1,
        type: 'O',
        acc_id: acc_ori_id,
        transfer_id: id
      },
      { 
        description: `Transfer from acc #${acc_ori_id}`, 
        date,
        ammount: tAmmount,
        type: 'I',
        acc_id: acc_des_id,
        transfer_id: id
      }
    ];

    await app.db('transactions')
      .where({ transfer_id: id })
      .del();

    await app.db('transactions').insert(transactions);
  
    return result;
  };

  return { find, findOne, save, update };
 
}
