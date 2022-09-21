const request = require('supertest')
const app = require('../../src/app')

describe('Auth Test', () => {
  
  test('Should get a token after login', async () => {
    const mail = `${Date.now()}@mail.com}`
    const result = await app.services.user.save({
      name: 'Any User Login',
      mail,
      passwd: 'any_password'
    })
    console.log(result)
    const signIn = await request(app).post('/auth/signin')
      .send({
        mail: result.mail,
        passwd: result.passwd
      })
    expect(signIn.status).toBe(200)
    expect(signIn.body).toHaveProperty('token')
  })

})