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
        console.log(res.body);

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
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.description).toBe('Transfer with success');
    });
  })

})