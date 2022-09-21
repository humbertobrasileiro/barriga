module.exports = (app) => {

  const findAll = async (filter = {}) => {
    return await app.db('users').where(filter).select()
  }
  
  const save = async (user) => {
    if (!user.name) return { error: 'The name is a required attribute'}
    if (!user.mail) return { error: 'The mail is a required attribute'}
    if (!user.passwd) return { error: 'The password is a required attribute'}

    const userDb = findAll({ mail: user.mail })

    return await app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
