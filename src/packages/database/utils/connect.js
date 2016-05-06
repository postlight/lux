import knex from 'knex';

export default function connect(config = {}) {
  const {
    host,
    database,
    password,
    dialect: client,
    username: user
  } = config;

  return knex({
    client,

    connection: {
      host,
      user,
      password,
      database
    },

    pool: {
      min: 0,
      max: 8
    },

    debug: false
  });
}
