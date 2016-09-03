const {
  env: {
    DATABASE_DRIVER,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
  }
} = process;

export default {
  development: {
    driver: 'sqlite3',
    database: 'lux_test'
  },
  test: {
    driver: DATABASE_DRIVER,
    database: 'lux_test',
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD
  },
  production: {
    driver: 'sqlite3',
    database: 'lux_test'
  }
};
