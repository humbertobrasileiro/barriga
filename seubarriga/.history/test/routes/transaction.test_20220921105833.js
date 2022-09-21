const request = require('supertest')
const app = require('../../src/app')
const jwt = require('jwt-simple')

const MAIN_ROUTE = '/v1/transactions'

let user1
let account1
let user2
let account2

beforeAll(async () => {
  await app.db('transactions').del()
  await app.db('accounts').del()
  await app.db('users').del()

  // Add users for test
  const users = await app.services.user.save([
    { 
      name: 'User #1', 
      mail: 'user1@mail.com', 
      passwd: '123456'
    },
    { 
      name: 'User #2', 
      mail: 'user2@mail.com', 
      passwd: '123456'
    }
  ], '*')
  user1 = { ...users[0] }
  user2 = { ...users[1] }
  delete user1.passwd
  user1.token = jwt.encode(user1, 'Segredo!')
  console.log(user1)

  // Add accounts for test
  const accounts = await app.services.account.save([
    {
      name: 'Acc #1', 
      user_id: user1.id
    },
    {
      name: 'Acc #2', 
      user_id: user2.id
    }
  ], '*')
  account1 = { ...accounts[0] }
  account2 = { ...accounts[1] }
})

describe('Transactions test', () => {

  test('Should list only transactions of the user', () => {
    return app.db('transactions').insert([
      {
        description: 'T1', 
        date: new Date(), 
        ammount: 100, 
        type: 'I', 
        acc_id: account1.id
      },
      {
        description: 'T2', 
        date: new Date(), 
        ammount: 200, 
        type: 'O', 
        acc_id: account2.id
      }
    ])
    .then(() => request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${user1.token}`)
    )
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body.description).toBe('T1')
    })
  })
})
