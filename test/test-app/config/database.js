export default (
  ['development', 'test', 'production'].reduce((config, env) => (
    Object.assign(config, {
      [env]: {
        pool: 2,
        driver: process.env.DATABASE_DRIVER || 'sqlite3',
        database: 'lux_test',
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      },
    })
  ), {})
);
