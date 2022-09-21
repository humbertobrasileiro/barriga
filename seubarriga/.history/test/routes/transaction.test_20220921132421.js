const request = require('supertest')
const app = require('../../src/app')
const jwt = require('jwt-simple')

const MAIN_ROUTE = '/v1/transactions'

let user1
let accUser1
let user2
let accUser2

beforeAll(async () => {
  await app.db('transactions').del()
  await app.db('accounts').del()
  await app.db('users').del()

  // Add users for test
  const user1 = await app.services.user.save({ 
    name: 'User #1', 
    mail: 'user1@mail.com', 
    passwd: '123456'
  })

  const user2 = await app.services.user.save({ 
    name: 'User #2', 
    mail: 'user2@mail.com', 
    passwd: '123456'
  })

  delete user1.passwd
  user1.token = jwt.encode(user1, 'Segredo!')

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
  ], '*')
  [ accUser1, accUser2 ] = accs
})

describe('Transactions test', () => {

  test('Should list only transactions of the user', () => {
    console.log(acc1)
    return app.db('transactions').insert([
      {
        description: 'T1', 
        date: new Date(), 
        ammount: 100, 
        type: 'I', 
        acc_id: acc1.id
      },
      {
        description: 'T2', 
        date: new Date(), 
        ammount: 200, 
        type: 'O', 
        acc_id: acc2.id
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
    })
  })
})
