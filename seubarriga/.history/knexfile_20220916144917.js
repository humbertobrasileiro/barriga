module.exports = {
  test: {
    client: 'pg',
    version: '14',
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