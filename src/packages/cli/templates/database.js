export default (name) => {
  name = name.replace('-', '_');

  return `
export default {
  development: {
    host: '127.0.0.1',
    pool: { min: 0, max: 8 },
    driver: 'mysql2',
    username: 'root',
    password: null,
    database: '${name}_dev'
  },

  test: {
    host: '127.0.0.1',
    pool: { min: 0, max: 8 },
    driver: 'mysql2',
    username: 'root',
    password: null,
    database: '${name}_test'
  },

  production: {
    host: '127.0.0.1',
    pool: { min: 0, max: 8 },
    driver: 'mysql2',
    username: 'root',
    password: null,
    database: '${name}_prod'
  }
};
  `.substr(1).trim();
};
