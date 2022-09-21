// Update with your config settings.

module.exports = {

  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'admin',
      database: 'barriga',
      connectTimeout: 90000,
    },
    migrations: {
      directory: 'src/migrations'
    }
  },

};
