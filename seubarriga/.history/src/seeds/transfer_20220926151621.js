const passport = require('passport');

exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('transactions').del()
    .then(() => knex('transfers').del())
    .then(() => knex('accounts').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert([
      { id: 10001, name: 'User #1', mail: 'user1@mail.com', passwd: '$2a$10$7C5k85zM22XOrO7t5ZeXF.a.9vJ7diRyfsISeKIBm0ksw3JNbbvMi' },
      { id: 10002, name: 'User #2', mail: 'user2@mail.com', passwd: '$2a$10$7C5k85zM22XOrO7t5ZeXF.a.9vJ7diRyfsISeKIBm0ksw3JNbbvMi' }
    ]))
    .then(() => knex('accounts').insert([
      { id: 10001, name: 'AccO #1', user_id: 10001 },
      { id: 10002, name: 'AccD #1', user_id: 10001 },
      { id: 10003, name: 'AccO #2', user_id: 10002 },
      { id: 10004, name: 'AccD #2', user_id: 10002 }
    ]))
    .then(() => knex('transfers').insert([
      { id: 10001, description: 'Transfer #1', user_id: 10001, acc_ori_id: 10001, acc_des_id: 10002, ammount: 100, date: new Date() },
      { id: 10002, description: 'Transfer #2', user_id: 10002, acc_ori_id: 10003, acc_des_id: 10004, ammount: 100, date: new Date() }
    ]))
    .then(() => knex('transactions').insert([
      { description: 'Transfer from AccO #1', date: new Date(), ammount: 100, type: 'I', acc_id: 10002, transfer_id: 10001 },
      { description: 'Transfer to AccD #1', date: new Date(), ammount: -100, type: 'O', acc_id: 10001, transfer_id: 10001 },
      { description: 'Transfer from AccO #2', date: new Date(), ammount: 100, type: 'I', acc_id: 10003, transfer_id: 10002 },
      { description: 'Transfer to AccD #2', date: new Date(), ammount: -100, type: 'O', acc_id: 10004, transfer_id: 10002 }
    ]))
};
