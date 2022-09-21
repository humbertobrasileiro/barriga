const validationError = require('../errors/validationError')

module.exports = (app) => {

  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select()
  }
  
  const save = async (user) => {
    if (!user.name) {
      throw new validationError('The name is a required attribute')
    }
    if (!user.mail) {
      throw new validationError('The mail is a required attribute')
    }
    if (!user.passwd) {
      throw new validationError('The password is a required attribute')
    }

    const userDb = await findAll({ mail: user.mail })

    if (userDb && userDb.length > 0) {
      throw new validationError('There is a user with this registered email')
    }

    return await app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
