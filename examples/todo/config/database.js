export default {
  development: {
    username: 'root',
    password: 'root',
    database: 'todo_dev',
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    logging: false
  },

  test: {
    username: 'root',
    password: 'root',
    database: 'todo_test',
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    logging: false
  },

  production: {
    username: 'root',
    password: 'root',
    database: 'todo_prod',
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    logging: false
  }
};
