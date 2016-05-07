export default (name) => {
  name = name.replace('-', '_');

  return `
const development = {
  username: 'root',
  password: 'root',
  database: '${name}_dev',
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
  logging: false
};

const test = {
  username: 'root',
  password: 'root',
  database: '${name}_test',
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
  logging: false
};

const production = {
  username: 'root',
  password: 'root',
  database: '${name}_prod',
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
  logging: false
};

export { development, test, production };
  `.substr(1).trim();
};

