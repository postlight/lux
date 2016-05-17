export default {
  development: {
    driver: 'sqlite3',
    database: 'social_network_dev'
  },

  test: {
    driver: 'sqlite3',
    database: 'social_network_test'
  },

  production: {
    driver: 'sqlite3',
    database: 'social_network_prod'
  }
};