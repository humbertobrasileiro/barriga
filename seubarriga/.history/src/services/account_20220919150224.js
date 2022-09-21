module.exports = (app) => {

  const findAll = () => {
    return app.db('accounts')
  }
  
  const find = (filter = {}) => {
    return app.db('accounts').where(filter).first()
  }

  const save = async (account) => {
    if (!account.name) return { error: 'The name is a required attribute' }
    if (!account.user_id) return { error: 'The user id is a required attribute' }
    return await app.db('accounts').insert(account, '*')
  }

  return { findAll, find, save }
}
