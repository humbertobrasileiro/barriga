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
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: 'src/migrations'
    }
  },

};
