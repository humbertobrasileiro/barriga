const app = require('express')()
const consign = require('consign')
const knex = require('knex')
const knexfile = require('../knexfile')
const knewLogger = require('knex-logger')

// TODO criar chaveamento dinâmico
app.db = knex(knexfile.test)

consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./routes')
  .then('./config/routes.js')
  .into(app)

app.get('/', (req, res) => {
  res.status(200).send()
})

module.exports = app