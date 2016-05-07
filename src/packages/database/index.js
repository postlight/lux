import Promise from 'bluebird';
import cluster from 'cluster';

import {
  ModelMissingError,
  MigrationsPendingError
} from './errors';

import connect from './utils/connect';
import initializeModel from './utils/initialize-model';
import createMigrations from './utils/create-migrations';
import pendingMigrations from './utils/pending-migrations';

import bound from '../../decorators/bound';
import readonly from '../../decorators/readonly';
import nonenumerable from '../../decorators/nonenumerable';
import nonconfigurable from '../../decorators/nonconfigurable';

const { defineProperties } = Object;
const { worker, isMaster } = cluster;
const { env: { NODE_ENV: environment = 'development' } } = process;

class Database {
  debug;
  logger;
  config;
  connection;

  @readonly
  @nonenumerable
  @nonconfigurable
  models = new Map();

  constructor({ logger, config: { [environment]: config } }) {
    const { debug = environment === 'development' } = config;

    defineProperties(this, {
      debug: {
        value: debug,
        writable: false,
        enumerable: false,
        configurable: false
      },

      logger: {
        value: logger,
        writable: false,
        enumerable: false,
        configurable: false
      },

      config: {
        value: config,
        writable: false,
        enumerable: true,
        configurable: false
      },

      connection: {
        value: connect(config),
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    return this;
  }

  @bound
  schema() {
    const {
      connection: {
        schema
      }
    } = this;

    return schema;
  }

  modelFor(type) {
    const model = this.models.get(type);

    if (!model) {
      throw new ModelMissingError(type);
    }

    return model;
  }

  async define(models) {
    const { connection, schema } = this;

    if (isMaster || worker && worker.id === 1) {
      await createMigrations(schema);

      const pending = await pendingMigrations(() => {
        return connection('migrations');
      });

      if (pending.length) {
        throw new MigrationsPendingError(pending);
      }
    }

    models.forEach((model, name) => {
      this.models.set(name, model);
    });

    return await Promise.all(
      [...models.values()]
        .map(model => {
          return initializeModel(this, model, () => {
            return connection(model.tableName);
          });
        })
    );
  }
}

export connect from './utils/connect';
export createMigrations from './utils/create-migrations';
export pendingMigrations from './utils/pending-migrations';
export default Database;
