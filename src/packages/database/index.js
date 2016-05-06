import Promise from 'bluebird';
import cluster from 'cluster';

import {
  ModelMissingError,
  MigrationsPendingError
} from './errors';

import fs from '../fs';

import connect from './utils/connect';
import initializeModel from './utils/initialize-model';
import getPendingMigrations from './utils/get-pending-migrations';
import createMigrationsTable from './utils/create-migrations-table';

import bound from '../../decorators/bound';
import readonly from '../../decorators/readonly';
import nonenumerable from '../../decorators/nonenumerable';
import nonconfigurable from '../../decorators/nonconfigurable';

const { defineProperties } = Object;
const { worker, isMaster } = cluster;
const { env: { PWD, NODE_ENV: environment = 'development' } } = process;

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
      await createMigrationsTable(schema);

      const pending = await getPendingMigrations(() => {
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

  async migrate() {
    const { connection, schema } = this;

    await createMigrationsTable(schema);

    const pending = await getPendingMigrations(() => {
      return connection('migrations');
    });

    if (pending.length) {
      await Promise.all(
        pending.map(async (migration) => {
          const { up } = require(`${PWD}/db/migrate/${migration}`);
          const version = migration.replace(/^(\d{16})-.+$/g, '$1');

          await up(schema());
          await connection('migrations').insert({ version });
        })
      );
    }
  }

  async rollback() {
    const { connection, schema } = this;
    const migrations = await fs.readdirAsync(`${PWD}/db/migrate`);

    await createMigrationsTable(schema);

    if (migrations.length) {
      const { version } = await connection('migrations')
        .orderBy('version', 'desc')
        .first();

      const target = migrations.find(migration => {
        return migration.indexOf(version) === 0;
      });

      if (target) {
        const { down } = require(`${PWD}/db/migrate/${target}`);

        await down(schema());
        await connection('migrations').where({ version }).del();
      }
    }
  }
}

export default Database;
