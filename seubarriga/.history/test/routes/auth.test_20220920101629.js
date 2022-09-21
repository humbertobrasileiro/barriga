const request = require('supertest')
const app = require('../../src/app')

describe('Auth Test', () => {
  
  test('Should get a token after login', () => {
    const mail = `${Date.now()}@mail.com}`
    return app.services.user.save(
      {
        name: 'Any User Login',
        mail,
        passwd: 'any_password'
      }
    ).then(() => request(app).post('/auth/signin')
      .send(
        {
          mail,
          passwd: 'any_password'
        }
      ))
      .then(res => {
        expect(res.status).toBe(200)
        console.log(res.body)
        expect(res.body).toHaveProperty('token')
      })
  })

})