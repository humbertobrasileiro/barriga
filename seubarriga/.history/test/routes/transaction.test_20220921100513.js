const request = require('supertest')
const app = require('../../src/app')
const jwt = require('jwt-simple')

const MAIN_ROUTE = '/v1/accounts'

let user1, account1
let user2, account2

beforeAll(async () => {
  await app.db('transactions').del()
  await app.db('accounts').del()
  await app.db('users').del()

  // Add users for test
  const users = await app.db('users').insert([
    { 
      name: 'User #1', 
      mail: 'user1@mail.com', 
      passwd: '$2a$10$Ayg/suX2rFnlA4xLS921Q.PtdnIrQ7Bxa.bGstJ3elGs5fG0CcIUO'
    },
    { 
      name: 'User #2', 
      mail: 'user2@mail.com', 
      passwd: '$2a$10$Ayg/suX2rFnlA4xLS921Q.PtdnIrQ7Bxa.bGstJ3elGs5fG0CcIUO'
    }
  ], '*')
  [user1, user2] = users
  delete user1.passwd
  user1.token = jwt.encode(user1, 'Segredo!')

  // Add accounts for test
  const accounts = await app.db('accounts').insert([
    {
      name: 'Acc #1', 
      user_id: user1.id
    },
    {
      name: 'Acc #2', 
      user_id: user2.id
    }
  ], '*')
  [account1, account2] = accounts
})

describe('Transactions test', () => {

  test('Should list only transactions of the user', () => {
    return app.db('transactions').insert([
      {description: 'T1', date: new Date(), ammount: 100, type: 'I', acc_id: account1.id},
      {description: 'T2', date: new Date(), ammount: 200, type: 'O', acc_id: account2.id}
    ])
  })
})
