const request = require('supertest');
const moment = require('moment');
const app = require('../../src/app');
const jwt = require('jwt-simple');

const MAIN_ROUTE = '/v1/balance';
const ROUTE_TRANSACTION = '/v1/transactions';
const ROUTE_TRANSFER = '/v1/transfers';

const logUser = {
  id: 10100,
  name: 'User #3',
  mail: 'user3@mail.com'
};
const TOKEN = jwt.encode(logUser, 'Segredo!');

const logUser2 = {
  id: 10102,
  name: 'User #5',
  mail: 'user5@mail.com'
};
const TOKEN_GERAL = jwt.encode(logUser2, 'Segredo!');

beforeAll(async () => {
  await app.db.seed.run();
});

describe('When calculate a user balance...', () => {
  
  test('It should return only accounts with some transaction', () => {
    return request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });
  });
  
  test('Should add values of input', async () => {
    await request(app).post(ROUTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: 'Should add values of input',
        date: new Date(),
        ammount: 100,
        type: 'I',
        acc_id: 10100,
        status: true
      });
    
    const res = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(10100);
    expect(res.body[0].sum).toBe('100.00');
  });
  
  test('Should subtract output values', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: 'Should subtract output values',
        date: new Date(),
        ammount: 200,
        type: 'O',
        acc_id: 10100,
        status: true
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            console.log('subtract', res.body[0].sum);
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('-100.00');
        });
      });
  });

  test('Should not consider pending transactions', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: 'Should not consider pending transactions',
        date: new Date(),
        ammount: 200,
        type: 'O',
        acc_id: 10100,
        status: false
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            console.log('consider', res.body[0].sum);
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('-100.00');
        });
      });
  });
  
  test('Should not mix balances from different accounts', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: 'Should not mix balances',
        date: new Date(),
        ammount: 50,
        type: 'I',
        acc_id: 10101,
        status: true
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            console.log('not mix balances', res.body[0].sum, res.body[1].sum);
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('-100.00');
            expect(res.body[1].id).toBe(10101);
            expect(res.body[1].sum).toBe('50.00');
        });
      });
  });
  
  test('Should not mix accounts from another users', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: 'Should not mix accounts from another users',
        date: new Date(),
        ammount: 200,
        type: 'O',
        acc_id: 10102,
        status: true
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            console.log('not mix balances', res.body[0].sum, res.body[1].sum);
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('-100.00');
            expect(res.body[1].id).toBe(10101);
            expect(res.body[1].sum).toBe('50.00');
        });
      });
  });
  
  test('Should consider old transaction', async () => {
    await request(app).post(ROUTE_TRANSACTION)
      .send({
        description: 'Should consider old transaction',
        date: moment().subtract({days: 5}),
        ammount: 250,
        type: 'I',
        acc_id: 10100,
        status: true
      })
      .set('authorization', `bearer ${TOKEN}`);

    const res = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);

    console.log('Should consider old transaction', res.body[0].sum, res.body[1].sum);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].id).toBe(10100);
    expect(res.body[0].sum).toBe('150.00');
    expect(res.body[1].id).toBe(10101);
    expect(res.body[1].sum).toBe('50.00');      
  });
  
  test('Should not consider future transaction', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: 'Should not consider future transaction',
        date: moment().add({days: 5}),
        ammount: 250,
        type: 'I',
        acc_id: 10100,
        status: true
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            console.log('Should not consider future transaction', res.body[0].sum, res.body[1].sum);
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('150.00');
            expect(res.body[1].id).toBe(10101);
            expect(res.body[1].sum).toBe('50.00');
        });
      });
  });
  
  test('Should consider transfers', async () => {
    const result = await request(app).post(ROUTE_TRANSFER)
      .send({
        description: 'Should consider transfers',
        date: new Date(),
        ammount: 250,
        acc_ori_id: 10100,
        acc_des_id: 10101,
        user_id: 10100
      })
      .set('authorization', `bearer ${TOKEN}`);

      console.log('i', result);

      const res = await request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${TOKEN}`);

      console.log('Should consider transfers', res.body[0].sum, res.body[1].sum);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].id).toBe(10100);
      expect(res.body[0].sum).toBe('-100.00');
      expect(res.body[1].id).toBe(10101);
      expect(res.body[1].sum).toBe('300.00');
  });

  test('should calculate the balance of the accounts of users', () => {
    return request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN_GERAL}`)
      .then(res => {
        console.log('Should consider transfers', res.body[0].sum, res.body[1].sum);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].id).toBe(10104);
        expect(res.body[0].sum).toBe('162.00');
        expect(res.body[1].id).toBe(10105);
        expect(res.body[1].sum).toBe('-248.00');
    });
  });

});