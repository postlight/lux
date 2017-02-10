const {
  env: {
    DATABASE_DRIVER = 'sqlite3',
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
  }
} = process;

export default {
  development: {
    pool: 5,
    driver: 'sqlite3',
    database: 'lux_test'
  },
  test: {
    pool: 5,
    port: 3307,
    driver: DATABASE_DRIVER,
    database: 'lux_test',
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD
  },
  production: {
    pool: 5,
    driver: 'sqlite3',
    database: 'lux_test'
  }
};
