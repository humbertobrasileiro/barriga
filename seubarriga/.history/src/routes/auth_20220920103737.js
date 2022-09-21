const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const validationError = require('../errors/validationError')

const secret = 'Segredo!'

module.exports = (app) => {

  const signin = async (req, res, next) => {
    await app.services.user.findOne({ mail: req.body.mail })
      .then(user => {
        if (!user) {
          throw new validationError('User or password invalid')
        }
        if (bcrypt.compareSync(req.body.passwd, user.passwd)) {
          const payload = {
            id: user.id,
            name: user.name,
            mail: user.mail,
          }
          const token = jwt.encode(payload, secret)
          res.status(200).json({ token })
        } else {
          throw new validationError('User or password invalid')
        }
      })
      .catch(err => next(err))
  }

  return {
    signin
  }
}