const { env: { DATABASE_DRIVER = 'sqlite3' } } = process;
const environments = ['development', 'test', 'production'];

export default environments.reduce((config, key) => ({
  ...config,
  [key]: {
    driver: DATABASE_DRIVER,
    database: 'lux_test'
  }
}), {});
