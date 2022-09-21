const bodyParser = require('body-parser')

module.exports = (app) => {
  use(bodyParser.json())
}
