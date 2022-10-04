const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/balance';
const ROUTE_TRANSACTION = '/v1/transactions';
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
  
  test('Should add values of input', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: '1',
        date: new Date(),
        ammount: 100,
        type: 'I',
        acc_id: 10100,
        status: true
      })
      .then(res => {
      
    });
  });
  
  test('Should subtract output values', () => {

  });

  test('Should not consider pending transactions', () => {
    
  })
  
  test('Should not mix balances from different accounts', () => {

  });
  
  test('Should not mix accounts from another users', () => {

  });
  
  test('Should consider old transaction', () => {

  });
  
  test('Should not consider future transaction', () => {

  });
  
  test('Should consider transfers', () => {

  });

})