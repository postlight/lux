export default (name) => {
  name = name.replace('-', '_');

  return `
{
  "development": {
    "username": "root",
    "password": "root",
    "database": "${name}_dev",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql",
    "logging": false
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "${name}_test",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": "root",
    "password": "root",
    "database": "${name}_prod",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql",
    "logging": false
  }
}
  `.substr(1).trim();
};
