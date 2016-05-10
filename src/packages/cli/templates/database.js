export default (name) => {
  name = name.replace('-', '_');

  return `
export default {
  development: {
    username: 'root',
    password: null,
    database: '${name}_dev',
    host: '127.0.0.1',
    dialect: 'mysql'
  },

  test: {
    username: 'root',
    password: null,
    database: '${name}_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },

  production: {
    username: 'root',
    password: null,
    database: '${name}_prod',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
  `.substr(1).trim();
};
