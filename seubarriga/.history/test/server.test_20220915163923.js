const supertest = require('supertest')

const request = supertest('http://ww.google.com')

describe('Server test', () => {

  test('Deve responder na porta 3001', () => {
    // acessar a url http://localhost:3001
    return request.get('/').then(resolve => expect(resolve.status).toBe(400));
    // devo verificar que a resposta foi 200
  })

})