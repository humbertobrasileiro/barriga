const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/balance';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxMDAsIm5hbWUiOiJVc2VyICMzIiwibWFpbCI6InVzZXIzQG1haWwuY29tIn0.haEEjbmL_75BKW-tuVDBSXW9djjQoTfH6t-5ot0cwP4';

beforeAll(async () => {
  await app.db.seed.run();
});

describe('When calculate a user balance...', () => {
  
  test('It should return only accounts with some transaction', () => {

  });
  
  test('Should add values of input', () => {

  });
  
  test('Should subtract output values', () => {

  });
  
  test('Should not mix balances from different accounts', () => {

  });
  
  test('Should not mix accounts from another users', () => {

  });
  
  test('', () => {

  });
  
  test('', () => {

  });
  
  test('', () => {

  });

})