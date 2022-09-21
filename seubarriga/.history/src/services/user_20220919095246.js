module.exports = (app) => {

  const findAll = () => {
    return app.db('users').select()
  }
  
  const save = (user) => {
    if (!user.name) return { error: 'The name is a required attribute'}
    return app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
