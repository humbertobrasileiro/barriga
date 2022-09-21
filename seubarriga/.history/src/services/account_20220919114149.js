module.exports = (app) => {

  const findAll = (filter = {}) => {
    return app.db('accounts').where(filter).select()
  }
  
  const save = async (account) => {
    if (!account.name) return { error: 'The name is a required attribute'}
    return await app.db('accounts').insert(account, '*')
  }

  return { findAll, save }
}
