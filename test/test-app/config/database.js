export default {
  development: {
    username: 'root',
    password: 'root',
    database: 'lux_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },

  test: {
    username: 'travis',
    password: null,
    database: 'lux_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },

  production: {
    username: 'root',
    password: 'root',
    database: 'lux_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
