const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transfers';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAsIm5hbWUiOiJVc2VyICMxIiwibWFpbCI6InVzZXIxQG1haWwuY29tIn0.QMgvo_lPe0Rdxpx7cay_hIkDAbjCK_--VD2fP0NTTqk';

beforeAll(async () => {
  await app.db.seed.run();
});

describe('Transfers Test', () => {
  
  test('Should only list transfers of this logged in user', () => {
    return request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].description).toBe('Transfer #1');
    });
  });

  test('Should Add a Transfer with success', () => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: 'Transfer with success',
        user_id: 10000,
        acc_ori_id: 10000,
        acc_des_id: 10001,
        ammount: 100,
        date: new Date()
      })
      .then(async res => {
        expect(res.status).toBe(201);
        expect(res.body.description).toBe('Transfer with success');

        const transactions = await app.db('transactions').where({ transfer_id: res.body.id });
        expect(transactions).toHaveLength(2);
        expect(transactions[0].description).toBe('Transfer to acc #10001');
        expect(transactions[1].description).toBe('Transfer from acc #10000');
        expect(transactions[0].ammount).toBe('-100.00');
        expect(transactions[1].ammount).toBe('100.00');
        expect(transactions[0].acc_id).toBe(10000);
        expect(transactions[1].acc_id).toBe(10001);
    });
  });

})

describe('When saving a valid transfer...', () => {

  let transferId;
  let income;
  let outcome;

  test('Should return 201 and the transfer data', () => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({
        description: 'Regular Transfer',
        user_id: 10000,
        acc_ori_id: 10000,
        acc_des_id: 10001,
        ammount: 100,
        date: new Date()
      })
      .then(async res => {
        expect(res.status).toBe(201);
        expect(res.body.description).toBe('Regular Transfer');
        transferId = res.body.id;
      });
  });

  test('Equivalent transactions must have been generated', async () => {
    const transactions = await app.db('transactions')
      .where({ transfer_id: transferId })
      .orderBy('ammount');
    expect(transactions).toHaveLength(2);
    [ outcome, income ] = transactions;
  });

  test('The transaction of output should be negative', () => {
    expect(outcome.description).toBe('Transfer to acc #10001');
    expect(outcome.ammount).toBe('-100.00');
    expect(outcome.acc_id).toBe(10000);
    expect(outcome.type).toBe('O');
  });

  test('The transaction of input should be positive', () => {
    expect(income.description).toBe('Transfer from acc #10000');
    expect(income.ammount).toBe('100.00');
    expect(income.acc_id).toBe(10001);
    expect(income.type).toBe('I');
  });

  test('Both must reference the transfer that originated', () => {
    expect(income.transfer_id).toBe(transferId);
    expect(outcome.transfer_id).toBe(transferId);
  });

});

describe('When trying to save an invalid transfer...', () => {

  const testTemplate = (newData, errorMessage) => {
    const validTransfer = {
      description: 'Regular Transfer',
      user_id: 10000,
      acc_ori_id: 10000,
      acc_des_id: 10001,
      ammount: 100,
      date: new Date()
    };
      
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ ...validTransfer, ...newData})
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
    });
  };

  test('Should not Add Transfer without description', () =>
    testTemplate({ description: null }, 'The description is a required attribute')
  );

  test('Should not Add Transfer without ammount', () => 
    testTemplate({ ammount: null }, 'The ammount is a required attribute')  
  );

  test('Should not Add Transfer without date', () => 
    testTemplate({ date: null }, 'The date is a required attribute')  
  );

  test('Should not Add Transfer without originating account', () => {
    testTemplate({ acc_ori_id: null }, 'The originating account is a required attribute')  
  });

  test('Should not Add Transfer without destination account', () => {
    testTemplate({ acc_des_id: null }, 'The destination account is a required attribute')  
  });

  test('Should not Add Transfer if account origin and destiny as equal', () => 
    testTemplate({ acc_des_id: 10000 }, 'The account origin and destiny cannot equal')
  );

  test('Should not Add Transfer if an account is another user', () => 
    testTemplate({ user_id: 10001 }, 'The account is another user')
  );

});

