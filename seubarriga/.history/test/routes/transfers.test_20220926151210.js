const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transfers';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6LTEsIm5hbWUiOiJVc2VyICMxIiwibWFpbCI6InVzZXIxQG1haWwuY29tIn0.W6jmuFPwZOhQfhBo15kBUfqWCS4UtpiJQ1f7m6q_4xs';

describe('Transfers Test', () => {
  
  test('Should only list transfers of this logged in user', () => {
    request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then(res => {

        console.log(res.body[0])

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].description).toBe('Transfer #1');
    });
  })

})