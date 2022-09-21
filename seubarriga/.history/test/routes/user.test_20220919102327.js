const request = require('supertest')

const app = require('../../src/app')

const mail = `${Date.now()}@mail.com}`

describe('User Test', () => {

  test('Should all users be list', async () => {
    const result = await request(app).get('/users')
    expect(result.status).toBe(200)
    expect(result.body.length).toBeGreaterThan(0)
  })

  test('Should Add User with success', async () => {
    const result = await request(app).post('/users')
      .send({ name: 'Carlos Humberto', mail, passwd: '123456' })
    expect(result.status).toBe(201)
    expect(result.body.name).toBe('Carlos Humberto')
  })

  test('Should not Add User without name', async () => {
    const result = await request(app).post('/users')
      .send({ mail: 'humbertobtoscano@gmail.com', passwd: '123456' })
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('The name is a required attribute')
  })

  test('Should not Add User without mail', async () => {
    const result = await request(app).post('/users')
      .send({ name: 'Carlos Humberto', passwd: '123456' })
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('The mail is a required attribute')
  })

  test('Should not Add User without password', (done) => {
    request(app).post('/users')
      .send({
        name: 'Carlos Humberto',
        mail: 'humbertobtoscano@gmail.com'
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('The password is a required attribute')
        done()
      })
      .catch(err => done.fail(err))
  })

  test('Should not Add User for duplicated mail', async () => {
    const result = await request(app).post('/users')
      .send({ 
        name: 'Carlos Humberto', 
        mail, 
        passwd: '123456' 
      })
    expect(result.status).toBe(201)
    expect(result.body.error).toBe('The name is a required attribute')
  })

})