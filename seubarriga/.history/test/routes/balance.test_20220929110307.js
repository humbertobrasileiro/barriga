const request = require('supertest');
const moment = require('moment');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/balance';
const ROUTE_TRANSACTION = '/v1/transactions';
const ROUTE_TRANSFER = '/v1/transfers';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxMDAsIm5hbWUiOiJVc2VyICMzIiwibWFpbCI6InVzZXIzQG1haWwuY29tIn0.haEEjbmL_75BKW-tuVDBSXW9djjQoTfH6t-5ot0cwP4';

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
        description: 'Bosta',
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
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: '1',
        date: new Date(),
        ammount: 200,
        type: 'O',
        acc_id: 10100,
        status: true
      })
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            console.log('t -----> ', res.body[0]);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('-100.00');
        });
      });
  });

  test('Should not consider pending transactions', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: '1',
        date: new Date(),
        ammount: 200,
        type: 'O',
        acc_id: 10100,
        status: false
      })
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('-100.00');
        });
      });
  });
  
  test('Should not mix balances from different accounts', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: '1',
        date: new Date(),
        ammount: 50,
        type: 'I',
        acc_id: 10101,
        status: true
      })
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
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
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: '1',
        date: new Date(),
        ammount: 200,
        type: 'O',
        acc_id: 10102,
        status: true
      })
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('-100.00');
            expect(res.body[1].id).toBe(10101);
            expect(res.body[1].sum).toBe('50.00');
        });
      });
  });
  
  test('Should consider old transaction', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: '1',
        date: moment().subtract({days: 5}),
        ammount: 250,
        type: 'I',
        acc_id: 10100,
        status: true
      })
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('150.00');
            expect(res.body[1].id).toBe(10101);
            expect(res.body[1].sum).toBe('50.00');
        });
      });
  });
  
  test('Should not consider future transaction', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: '1',
        date: moment().add({days: 5}),
        ammount: 250,
        type: 'I',
        acc_id: 10100,
        status: true
      })
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('150.00');
            expect(res.body[1].id).toBe(10101);
            expect(res.body[1].sum).toBe('50.00');
        });
      });
  });
  
  test('Should consider transfers', () => {
    return request(app).post(ROUTE_TRANSFER)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: '1',
        date: new Date(),
        ammount: 250,
        acc_ori_id: 10100,
        acc_des_id: 10101
      })
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(10100);
            expect(res.body[0].sum).toBe('-100.00');
            expect(res.body[1].id).toBe(10101);
            expect(res.body[1].sum).toBe('200.00');
        });
      });
  });

})