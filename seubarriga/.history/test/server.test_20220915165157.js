const supertest = require('supertest')

const request = supertest('http://localhost:3001')

describe('Server test', () => {

  test('Deve responder na porta 3001', async () => {
    await request.get('/').
      then(resolve => expect(resolve.status).toBe(200));
    // devo verificar que a resposta foi 200
  })

})