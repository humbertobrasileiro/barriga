module.exports = (app) => {

  const findAll = () => {
    return app.db('accounts').select()
  }
  
  const find = (filter = {}) => {
    return app.db('accounts').where(filter)
  }

  const save = async (account) => {
    if (!account.name) return { error: 'The name is a required attribute'}
    return await app.db('accounts').insert(account, '*')
  }

  return { findAll, find, save }
}
