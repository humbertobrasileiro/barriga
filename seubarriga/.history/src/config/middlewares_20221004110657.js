/* eslint-disable no-undef */
const bodyParser = require('body-parser');
// const knexLogger = require('knex-logger');

module.exports = (app) => {
  app.use(bodyParser.json());
  // app.use(knewLogger(app.db));
}