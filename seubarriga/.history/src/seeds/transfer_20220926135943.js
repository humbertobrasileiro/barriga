const passport = require('passport');

exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('transactions').del()
    .then(() => knex('transfers').del())
    .then(() => knex('accounts').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert([
      { id: 10000, name: 'User #1', mail: 'user1@mail.com', passwd: '$2a$10$7C5k85zM22XOrO7t5ZeXF.a.9vJ7diRyfsISeKIBm0ksw3JNbbvMi' },
      { id: 20000, name: 'User #2', mail: 'user2@mail.com', passwd: '$2a$10$7C5k85zM22XOrO7t5ZeXF.a.9vJ7diRyfsISeKIBm0ksw3JNbbvMi' }
    ]));
};
