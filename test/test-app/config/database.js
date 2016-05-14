const { env: { DB = 'mysql' } } = process;

let config;

switch (DB) {
  case 'mysql':
    config = {
      development: {
        pool: 5,
        driver: 'mysql2',
        username: 'root',
        password: 'root',
        database: 'lux_test'
      },

      test: {
        pool: 5,
        driver: 'mysql2',
        username: 'travis',
        database: 'lux_test'
      },

      production: {
        pool: 5,
        driver: 'mysql2',
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
      pool: 5,
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
