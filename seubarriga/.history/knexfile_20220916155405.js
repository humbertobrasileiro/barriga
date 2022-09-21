module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'admin',
      database: 'barriga',
      connectTimeout: 90000,
    },
    debug: true,
    pool: {
      min: 1,
      max: 20,
    },
    migrations: {
      directory: 'src/migrations',
    }
  }
}