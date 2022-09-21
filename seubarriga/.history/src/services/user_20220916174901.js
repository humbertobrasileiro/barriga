module.exports = (app) => {

  const findAll = async () => {
    await app.db('users').select()
  }
  
  const save = async (user) => {
    await app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
