const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple');

const MAIN_ROUTE = '/v1/transactions';

let user1;
let accUser1;
let user2;
let accUser2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();

  // Add users for test
  const users = await app.db('users').insert([
    { 
      name: 'User #1', 
      mail: 'user1@mail.com', 
      passwd: '$2a$10$7C5k85zM22XOrO7t5ZeXF.a.9vJ7diRyfsISeKIBm0ksw3JNbbvMi'
    },
    { 
      name: 'User #2', 
      mail: 'user2@mail.com', 
      passwd: '$2a$10$7C5k85zM22XOrO7t5ZeXF.a.9vJ7diRyfsISeKIBm0ksw3JNbbvMi'
    }
  ], '*');

  [ user1, user2 ] = users;

  delete user1.passwd;
  user1.token = jwt.encode(user1, 'Segredo!');

  // Add accounts for test
  const accs = await app.db('accounts').insert([
    {
      name: 'Acc #1', 
      user_id: user1.id,
    },
    {
      name: 'Acc #2', 
      user_id: user2.id
    }   
  ], '*');
  [ accUser1, accUser2 ] = accs;
});

describe('Transactions test', () => {

  test('Should list only transactions of the user', () => {
    console.log(accUser2)
    return app.db('transactions').insert([
      {
        description: 'T1', 
        date: new Date(), 
        ammount: 100, 
        type: 'I', 
        acc_id: accUser1.id
      },
      {
        description: 'T2', 
        date: new Date(), 
        ammount: 200, 
        type: 'O', 
        acc_id: accUser2.id
      }
    ])
    .then(() => request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${user1.token}`)
    )
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].description).toBe('T1')
    });
  });
});
