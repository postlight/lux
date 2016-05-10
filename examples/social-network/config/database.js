export default {
  development: {
    username: 'root',
    password: 'root',
    database: 'social_network_dev',
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    logging: false
  },

  test: {
    username: 'root',
    password: 'root',
    database: 'social_network_test',
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    logging: false
  },

  production: {
    username: 'root',
    password: 'root',
    database: 'social_network_prod',
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    logging: false
  }
};
