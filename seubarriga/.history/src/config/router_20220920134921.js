const express = require('express')

module.exports = (app) => {
  app.use('/auth', app.routes.auth)

  const protectedRouter = express.Router()

  protectedRouter.use('/users', app.config.passport.authenticate(), app.routes.users)
  protectedRouter.use('/accounts', app.config.passport.authenticate(), app.routes.accounts)
}