const { env: { DB = 'mysql' } } = process;

let config;

switch (DB) {
  case 'mysql':
    config = {
      development: {
        driver: 'mysql2',
        socket: '/tmp/mysql.sock',
        username: 'root',
        password: 'root',
        database: 'lux_test'
      },

      test: {
        driver: 'mysql2',
        username: 'travis',
        database: 'lux_test'
      },

      production: {
        driver: 'mysql2',
        socket: '/tmp/mysql.sock',
        username: 'root',
        password: 'root',
        database: 'lux_test'
      }
    };
    break;

  case 'sqlite':
    const sqlite = {
      driver: 'sqlite3',
      database: 'lux_test'
    };

    config = {
      development: sqlite,
      test: sqlite,
      production: sqlite
    };
    break;

  case 'postgresql':
    const postgresql = {
      driver: 'pg',
      username: 'postgres',
      database: 'lux_test'
    };

    config = {
      development: postgresql,
      test: postgresql,
      production: postgresql
    };
    break;
}

export default config;
