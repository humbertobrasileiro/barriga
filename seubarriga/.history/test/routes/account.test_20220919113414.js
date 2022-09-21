const request = require('supertest')
const app = require('../../src/app')

const MAIN_ROUTE = '/accounts'
let user

beforeAll(async () => {
  const res = await app.services.user.save({
    name: 'User Account',
    mail: `${Date.now()}@mail.com}`,
    passwd: '123456'
  })
  user = { ...res[0] }
})

describe('Accounts test', () => {
  
  test('Should Add Account with success', async () => {
    const result = await request(app).post(MAIN_ROUTE)
      .send({
        name: '#Acc 1',
        user_id: user.id
      })
    expect(result.status).toBe(201)
  })

})
