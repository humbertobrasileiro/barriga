const request = require('supertest')

const app = require('../src/app.js')

describe('App test', () => {
  
  test('Should answer in the root', async () => {
    await request(app).get('/')
      .then(res => {
        expect(res.status).toBe(200)
      })
  })

})
