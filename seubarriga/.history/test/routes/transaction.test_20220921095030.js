const request = require('supertest')
const app = require('../../src/app')
const jwt = require('jwt-simple')

const MAIN_ROUTE = '/v1/accounts'
let user
let user2

beforeAll(async () => {
  await app.db('transactions').del()
  await app.db('accounts').del()
  await app.db('users').del()
  await app.db('users').insert([
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
  ])
})

describe('Transactions test', () => {

  test('Should list only transactions of the user', () => {
    
  })
})
