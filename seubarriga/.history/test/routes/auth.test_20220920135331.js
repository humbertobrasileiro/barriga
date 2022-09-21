const request = require('supertest')
const app = require('../../src/app')

describe('Auth Test', () => {

  test('Should create a user through the signup route', async () => {
    const mail = `${Date.now()}@mail.com}`
    const res = await request(app).post('/auth/signup')
      .send({
        name: 'Any User',
        mail,
        passwd: 'any_password'
      })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Any User')
    expect(res.body).toHaveProperty('mail')
    expect(res.body).not.toHaveProperty('passwd')
  })
  
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
        expect(res.body).toHaveProperty('token')
      })
  })

  test('Should not authenticate with password wrong', () => {
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
          passwd: 'wrong_password'
        }
      ))
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('User or password invalid')
      })
  })

  test('Should not authenticate with not existing user', async () => {
    const mail = `${Date.now()}@mail.com}`
    const result = await request(app)
      .post('/auth/signin')
      .send(
        {
          mail,
          passwd: 'wrong_password'
        }
      )
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('User or password invalid')
  })

  test('Should not access a route protect without token', async () => {
    const res = await request(app).get('/users')
    expect(res.status).toBe(401)
  })

})