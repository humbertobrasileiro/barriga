const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple');

const MAIN_ROUTE = '/v1/transactions';

let user1;
let accUser1;
let user2;
let accUser2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();

  // Add users for test
  const users = await app.db('users').insert([
    { 
      name: 'User #1', 
      mail: 'user1@mail.com', 
      passwd: '$2a$10$7C5k85zM22XOrO7t5ZeXF.a.9vJ7diRyfsISeKIBm0ksw3JNbbvMi'
    },
    { 
      name: 'User #2', 
      mail: 'user2@mail.com', 
      passwd: '$2a$10$7C5k85zM22XOrO7t5ZeXF.a.9vJ7diRyfsISeKIBm0ksw3JNbbvMi'
    }
  ], '*');

  [ user1, user2 ] = users;

  delete user1.passwd;
  user1.token = jwt.encode(user1, 'Segredo!');

  // Add accounts for test
  const accs = await app.db('accounts').insert([
    {
      name: 'Acc #1', 
      user_id: user1.id,
    },
    {
      name: 'Acc #2', 
      user_id: user2.id
    }   
  ], '*');
  [ accUser1, accUser2 ] = accs;

});

describe('Transactions test', () => {

  const testTemplate = (newData, errorMessage) => {
    const validTransaction = {
      description: 'New T',
      type: 'I',
      date: new Date(),
      ammount: 100,
      acc_id: accUser1.id
    };
      
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user1.token}`)
      .send({ ...validTransaction, ...newData})
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
    });
  };

  test('Should list only transactions of the user', () => {
    return app.db('transactions').insert([
      {
        description: 'T1', 
        date: new Date(), 
        ammount: 100, 
        type: 'I', 
        acc_id: accUser1.id
      },
      {
        description: 'T2', 
        date: new Date(), 
        ammount: 200, 
        type: 'O', 
        acc_id: accUser2.id
      }
    ])
    .then(() => request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${user1.token}`)
    )
    .then(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].description).toBe('T1');
    });
  });

  test('Should work with snippets', () => {
    return request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${user1.token}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body[0].description).toBe('T1');
    });
  });

  test('Should Add Transaction with success', () => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user1.token}`)
      .send({
        description: 'New T',
        type: 'I',
        date: new Date(),
        ammount: 100,
        acc_id: accUser1.id
      })
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.acc_id).toBe(accUser1.id);
        expect(res.body.ammount).toBe('100.00');
    });
  });

  test('Should Add input Transaction with value positive', () => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user1.token}`)
      .send({
        description: 'New T',
        type: 'I',
        date: new Date(),
        ammount: -100,
        acc_id: accUser1.id
      })
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.acc_id).toBe(accUser1.id);
        expect(res.body.ammount).toBe('100.00');
    });
  });

  test('Should Add output Transaction with value negative', () => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user1.token}`)
      .send({
        description: 'New T',
        type: 'O',
        date: new Date(),
        ammount: 100,
        acc_id: accUser1.id
      })
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.acc_id).toBe(accUser1.id);
        expect(res.body.ammount).toBe('-100.00');
    });
  });

  test('Should not Add Transaction without description', () => 
    testTemplate({ description: null }, 'The description is a riquered attribute')
  );

  test('Should not Add Transaction without value', () => 
    testTemplate({ ammount: null }, 'The ammount is a riquered attribute')
  );

  test('Should not Add Transaction without date', () => 
    testTemplate({ date: null }, 'The date is a riquered attribute')
  );

  test('Should not Add Transaction without account', () => 
    testTemplate({ acc_id: null }, 'The account is a riquered attribute')
  );

  test('Should not Add Transaction without type', () => 
    testTemplate({ type: null }, 'The type is a riquered attribute')
  );

  test('Should not Add Transaction with invalid type', () => 
    testTemplate({ type: 'D' }, 'This type of transaction is invalid')
  );

  test('Should return one Transaction for id', async () => {
    const id = await app.db('transactions')
      .insert({
        description: 'Trans for id',
        type: 'I',
        date: new Date(),
        ammount: 300,
        acc_id: accUser1.id
      }, ['id']);

    const result = await request(app)
      .get(`${MAIN_ROUTE}/${id[0].id}`)
      .set('authorization', `bearer ${user1.token}`)
    
    expect(result.status).toBe(200);
    expect(result.body.description).toBe('Trans for id');  
    expect(result.body.id).toBe(id[0].id)
  });

  test('Should update an transaction', () => {
    return app.db('transactions')
      .insert({
        description: 'Update transaction',
        type: 'I',
        date: new Date(),
        ammount: 400,
        acc_id: accUser1.id
      }, ['id'])
      .then(trans => request(app).put(`${MAIN_ROUTE}/${trans[0].id}`)
        .set('authorization', `bearer ${user1.token}`)
        .send({
          description: 'Updated transaction'
        })
      )
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.description).toBe('Updated transaction');
      });
  });

  test('Should delete an transaction', () => {
    return app.db('transactions')
      .insert({
        description: 'Transaction to Remove',
        type: 'I',
        date: new Date(),
        ammount: 500,
        acc_id: accUser1.id
      }, ['id'])
      .then(trans => request(app)
        .delete(`${MAIN_ROUTE}/${trans[0].id}`)
        .set('authorization', `bearer ${user1.token}`)
      )
      .then(res => {
        expect(res.status).toBe(204);
      });
  });

  test('Should not delete transaction for another user not logged', () => {
    return app.db('transactions')
      .insert({
        description: 'Transaction to Remove',
        type: 'I',
        date: new Date(),
        ammount: 500,
        acc_id: accUser2.id
      }, ['id'])
      .then(trans => request(app)
        .delete(`${MAIN_ROUTE}/${trans[0].id}`)
        .set('authorization', `bearer ${user1.token}`)
      )
      .then(res => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('This feature cannot be accessed by the user who is logged in');
      });   
  });

  test('Should cannot remove Account if exists transactions', () => {
    return app.db('transactions')
      .insert({
        description: 'To Remove',
        type: 'I',
        date: new Date(),
        ammount: 500,
        acc_id: accUser1.id
      }, ['id'])
      .then(() => request(app)
        .delete(`/v1/accounts/${accUser1.id}`)
        .set('authorization', `bearer ${user1.token}`)
      )
      .then(res => {
        console.log(res.body);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('this Account has transactions in database')
      });
  })

});
