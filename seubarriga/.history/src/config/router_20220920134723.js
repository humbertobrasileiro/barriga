const express = require('express')

module.exports = (app) => {
  app.use('/auth', app.routes.auth)
  app.use('/users', app.config.passport.authenticate(), app.routes.users)
  app.use('/accounts', app.config.passport.authenticate(), app.routes.accounts)
}