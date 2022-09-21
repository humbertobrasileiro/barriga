const bodyParser = require('body-parser')

module.export = (app) => {
  use(bodyParser.json())
}
