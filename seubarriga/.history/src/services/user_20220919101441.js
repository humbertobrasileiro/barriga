module.exports = (app) => {

  const findAll = () => {
    return app.db('users').select()
  }
  
  const save = (user) => {
    if (!user.name) return { error: 'The name is a required attribute'}
    if (!user.mail) return { error: 'The mail is a required attribute'}
    if (!user.passwd) return { error: 'The password is a required attribute'}
    return app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
