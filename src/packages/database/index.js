import Promise from 'bluebird';
import cluster from 'cluster';

import {
  ModelMissingError,
  MigrationsPendingError
} from './errors';

import { initialize } from './model';

import connect from './utils/connect';
import createMigrations from './utils/create-migrations';
import pendingMigrations from './utils/pending-migrations';

import bound from '../../decorators/bound';
import readonly from '../../decorators/readonly';
import nonenumerable from '../../decorators/nonenumerable';
import nonconfigurable from '../../decorators/nonconfigurable';

const { defineProperties } = Object;
const { worker, isMaster } = cluster;
const { env: { PWD, NODE_ENV: environment = 'development' } } = process;

class Database {
  path;
  debug;
  logger;
  config;
  connection;

  @readonly
  @nonenumerable
  @nonconfigurable
  models = new Map();

  constructor({ path = PWD, logger, config: { [environment]: config } }) {
    const { debug = environment === 'development' } = config;

    defineProperties(this, {
      path: {
        value: path,
        writable: false,
        enumerable: false,
        configurable: false
      },

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
        value: connect(path, config),
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
    const { path, connection, schema } = this;

    if (isMaster || worker && worker.id === 1) {
      await createMigrations(schema);

      const pending = await pendingMigrations(path, () => {
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
          return initialize(this, model, () => {
            return connection(model.tableName);
          });
        })
    );
  }
}

export connect from './utils/connect';
export createMigrations from './utils/create-migrations';
export pendingMigrations from './utils/pending-migrations';

export Model from './model';
export default Database;
