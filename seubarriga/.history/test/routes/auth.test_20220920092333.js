const request = require('supertest')

const app = require('../../src/app')

describe('Auth Test', () => {
  
  test('Should get a token after login', async () => {
    const mail = `${Date.now()}@mail.com}`
    const result = await app.service.user.save({
      name: 'Any User Login',
      mail,
      passwd: 'any_password'
    })
    const signIn = await request(app).post('/auth/signin')
      .send({
        mail,
        passwd: 'any_password'
      })

  })

})