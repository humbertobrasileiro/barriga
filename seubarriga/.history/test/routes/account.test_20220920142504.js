const request = require('supertest')
const app = require('../../src/app')
const jwt = require('jwt-simple')

const MAIN_ROUTE = '/v1/accounts'
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

describe('Accounts test', () => {

  test('Should all accounts be list', async () => {
    const insert = await app.db('accounts').insert({
      name: 'Acc list',
      user_id: user.id
    })
    const result = await request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
    expect(result.status).toBe(200)
    expect(result.body.length).toBeGreaterThan(0)
  })
  
  test('Should Add Account with success', async () => {
    const result = await request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: '#Acc 1' })
    expect(result.status).toBe(201)
    expect(result.body.name).toBe('#Acc 1')
  })

  test('Should not Add Account without name', async () => {
    const result = await request(app).post(MAIN_ROUTE)
      .send({ teste: 'viado'})
      .set('authorization', `bearer ${user.token}`)
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('The name is a required attribute')
  })

  test('Should not Add Account without userId', async () => {
    const result = await request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: '#Acc 1' })
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('The user id is a required attribute')
  })

  test('Should return one Account for id', () => {
    return app.db('accounts')
      .insert({
        name: 'Acc By Id',
        user_id: user.id
      }, ['id'])
      .then(acc => request(app)
        .get(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`)
      )
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Acc By Id')    
        expect(res.body.user_id).toBe(user.id)    
      })
  })

  test('Should update an account', () => {
    return app.db('accounts')
      .insert({
        name: 'Acc To Update',
        user_id: user.id
      }, ['id'])
      .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`)
        .send({
          name: 'Acc Updated'
        })
      )
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Acc Updated')
      })
  })

  test('Should delete an account', () => {
    return app.db('accounts')
      .insert({
        name: 'Acc To Remove',
        user_id: user.id
      }, ['id'])
      .then(acc => request(app)
        .delete(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`)
      )
      .then(res => {
        expect(res.status).toBe(204)
      })
  })

  test('Should not add an Account duplicate', () => {
    
  })

  test('Should list only accounts for a user logged', () => {
    
  })

  test('Should not list account for another user not logged', () => {
    
  })

  test('Should not update account for another user not logged', () => {
    
  })

  test('Should not delete account for another user not logged', () => {
    
  })

})
