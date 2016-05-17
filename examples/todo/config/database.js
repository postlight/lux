export default {
  development: {
    driver: 'sqlite3',
    database: 'todo_dev'
  },

  test: {
    driver: 'sqlite3',
    database: 'todo_test'
  },

  production: {
    driver: 'sqlite3',
    database: 'todo_prod'
  }
};