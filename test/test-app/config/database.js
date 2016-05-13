const { env: { LUX_DB_DRIVER = 'mysql2' } } = process;

let config;

switch (LUX_DB_DRIVER) {
  case 'sqlite3':
    const sqlite3 = {
      driver: 'sqlite3',
      database: 'lux_test'
    };

    config = {
      development: sqlite3,
      test: sqlite3,
      production: sqlite3
    };
    break;

  case 'pg':
    config = {
      development: {
        driver: 'pg',
        username: 'zacharygolba',
        database: 'lux_test',

        pool: {
          min: 0,
          max: 8
        }
      },

      test: {
        driver: 'pg',
        username: 'travis',
        database: 'lux_test',

        pool: {
          min: 0,
          max: 8
        }
      },

      production: {
        driver: 'pg',
        username: 'postgres',
        database: 'lux_test',

        pool: {
          min: 0,
          max: 8
        }
      }
    };
    break;

  case 'mysql2':
    config = {
      development: {
        driver: 'mysql2',
        socket: '/tmp/mysql.sock',
        username: 'root',
        password: 'root',
        database: 'lux_test',

        pool: {
          min: 0,
          max: 8
        }
      },

      test: {
        driver: 'mysql2',
        username: 'travis',
        database: 'lux_test',

        pool: {
          min: 0,
          max: 8
        }
      },

      production: {
        driver: 'mysql2',
        socket: '/tmp/mysql.sock',
        username: 'root',
        password: 'root',
        database: 'lux_test',

        pool: {
          min: 0,
          max: 8
        }
      }
    };
    break;
}

export default config;
