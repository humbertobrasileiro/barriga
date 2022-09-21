const validationError = require('../errors/validationError')

module.exports = (app) => {

  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail'])
  }
  
  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first()
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

    const userDb = await findOne({ mail: user.mail })

    if (userDb) {
      throw new validationError('There is a user with this registered email')
    }

    return await app.db('users').insert(user, ['id', 'name', 'mail'])
  }

  return { findAll, findOne, save }
}
