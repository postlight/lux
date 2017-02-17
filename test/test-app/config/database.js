const {
  env: {
    DATABASE_DRIVER,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    CIRCLE_NODE_INDEX,
  }
} = process;

let driver;

switch (CIRCLE_NODE_INDEX) {
  case '0':
    driver = 'pg';
    break;

  case '1':
    driver = 'mysql2';
    break;

  case '2':
    driver = 'sqlite3';
    break;

  default:
    driver = DATABASE_DRIVER || 'sqlite3';
    break;
}

export default (
  ['development', 'test', 'production'].reduce((config, env) => (
    Object.assign(config, {
      [env]: {
        driver,
        pool: 2,
        database: 'lux_test',
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
      },
    })
  ), {})
);
