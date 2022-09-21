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
      tableName: 'src/migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
