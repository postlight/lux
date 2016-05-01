import Promise from 'bluebird';
import knex from 'knex';

import Base from '../base';

import initializeModel from './utils/initialize-model';

import { ModelMissingError } from './errors';

const { env: { NODE_ENV: environment = 'development' } } = process;
const knexKey = Symbol('connection');

class Database extends Base {
  models = new Map();

  constructor({ logger, config: { [environment]: config } }) {
    const {
      host,
      database,
      password,
      debug = environment === 'development',
      dialect: client,
      username: user
    } = config;

    return super({
      debug,
      logger,

      config: {
        host: '127.0.0.1',
        port: '3306',
        protocol: 'mysql',
        username: 'root',
        ...config
      },

      [knexKey]: knex({
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
      })
    });
  }

  define(models) {
    const { [knexKey]: connection } = this;

    models.forEach((model, name) => {
      this.models.set(name, model);
    });

    return Promise.all(
      [...models.values()]
        .map(model => {
          return initializeModel(this, model, () => {
            return connection(model.tableName);
          });
        })
    );
  }

  modelFor(type) {
    const model = this.models.get(type);

    if (!model) {
      throw new ModelMissingError(type);
    }

    return model;
  }
}

export default Database;
