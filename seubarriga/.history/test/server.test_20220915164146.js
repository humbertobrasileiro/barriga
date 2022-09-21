const supertest = require('supertest')

const request = supertest('http://www.google.com')

describe('Server test', () => {

  test('Deve responder na porta 3001', async () => {
    // acessar a url http://localhost:3001
    await request.get('/').then(resolve => expect(resolve.status).toBe(400));
    // devo verificar que a resposta foi 200
  })

})