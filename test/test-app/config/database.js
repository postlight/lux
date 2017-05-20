import * as os from 'os'

const {
  env: {
    APPVEYOR,
    DATABASE_DRIVER,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    CIRCLE_NODE_INDEX,
  },
} = process

const PG = 'pg'
const MYSQL2 = 'mysql2'
const SQLITE3 = 'sqlite3'

let pool
let driver

switch (CIRCLE_NODE_INDEX) {
  case '0':
    driver = PG
    break

  case '1':
    driver = MYSQL2
    break

  case '2':
    driver = SQLITE3
    break

  default:
    driver = DATABASE_DRIVER || SQLITE3
    break
}

if (driver === PG || driver === MYSQL2) {
  if (APPVEYOR) {
    pool = 2
  } else {
    pool = 8
  }
}

export default (
  ['development', 'test', 'production'].reduce((config, env) => (
    Object.assign(config, {
      [env]: {
        pool,
        driver,
        memory: driver === SQLITE3,
        database: 'lux_test',
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
      },
    })
  ), {})
)
