const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transfers';

describe('Transfers Test', () => {
  
  test('Should only list transfers of this logged in user', () => {
    request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].description).toBe('Transfer #1');
    });
  })

})