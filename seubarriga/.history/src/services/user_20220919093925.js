module.exports = (app) => {

  const findAll = () => {
    return app.db('users').select()
  }
  
  const save = async (user) => {
    if (user.name) return { error: 'Nome é um atributo obrigatório'}
    return await app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
