module.exports = {
  test: {
    client: 'pg',
    version: '7.7.1',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'admin',
      database: 'barriga',
    },
    migrations: {
      directory: 'src/migrations',
    }
  }
}