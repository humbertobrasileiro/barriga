const request = require('supertest')

const app = require('../../src/app')

describe('User Test', () => {

  test('Should all users be list', async () => {
    await request(app).get('/users')
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(1)
        expect(res.body[0]).toHaveProperty('Carlos Humberto', 'humbertobtoscano@gmail.com')
      })
  })

  test('Should Add User with success', async () => {
    await request(app).post('/users')
      .send({ name: 'Carlos Humberto', mail: 'humbertobtoscano@gmail.com', passwd: '123456' })
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Carlos Humberto')
      })
  })
})