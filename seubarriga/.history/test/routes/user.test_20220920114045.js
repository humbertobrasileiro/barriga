const request = require('supertest')
const jwt = require('jwt-simple')

const app = require('../../src/app')

const mail = `${Date.now()}@mail.com}`
let user

beforeAll(async () => {
  const res = await app.services.user.save({
    name: 'User Account',
    mail: `${Date.now()}@mail.com}`,
    passwd: '123456'
  })
  user = { ...res[0] }
  user.token = jwt.encode(user, 'Segredo!')
})

describe('Users Test', () => {

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
    expect(result.body).not.toHaveProperty('passwd')
  })

  test('Should save encrypted password', async () => {
    const result = await request(app).post('/users')
      .send({ name: 'Any User', mail: `${Date.now()}@mail.com}`, passwd: '123456' })
    const { id } = result.body
    const userDB = await app.services.user.findOne({ id })
    expect(result.status).toBe(201)
    expect(userDB.passwd).not.toBeUndefined()
    expect(userDB.passwd).not.toBe('123456')
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
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('There is a user with this registered email')
  })

})