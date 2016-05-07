const development = {
  username: 'root',
  password: 'root',
  database: 'todo_dev',
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
  logging: false
};

const test = {
  username: 'root',
  password: 'root',
  database: 'todo_test',
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
  logging: false
};

const production = {
  username: 'root',
  password: 'root',
  database: 'todo_prod',
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
  logging: false
};

export { development, test, production };
