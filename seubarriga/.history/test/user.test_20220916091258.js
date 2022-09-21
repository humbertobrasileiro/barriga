const request = require('supertest')

describe('User Test', () => {

  test('Deve listar todos os usuários', async () => {
    await request(app).get('/users')
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(1)
        expect(res.body[0]).toHaveProperty('name', 'John Doe')
      })
  })

})