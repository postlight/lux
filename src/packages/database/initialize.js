// @flow
import { worker, isMaster } from 'cluster';

import { NODE_ENV } from '../../constants';

import { MigrationsPendingError } from './errors';

import connect from './utils/connect';
import createMigrations from './utils/create-migrations';
import pendingMigrations from './utils/pending-migrations';

import type Database from './index';
import type Logger from '../logger';
import typeof Model from './model';

/**
 * @private
 */
export default async function initialize(instance: Database, {
  path,
  models,
  config,
  logger,
  checkMigrations
}: {
  path: string,
  models: Map<string, Model>,
  config: Object,
  logger: Logger,
  checkMigrations: boolean
}): Promise<Database> {
  config = config[NODE_ENV];

  const {
    debug = (NODE_ENV === 'development')
  }: {
    debug: boolean
  } = config;

  Object.defineProperties(instance, {
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

    models: {
      value: models,
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

    schema: {
      value: () => instance.connection.schema,
      writable: false,
      enumerable: false,
      configurable: false
    },

    connection: {
      value: connect(path, config),
      writable: false,
      enumerable: false,
      configurable: false
    }
  });

  if (isMaster || worker && worker.id === 1) {
    await createMigrations(instance.schema);

    if (checkMigrations) {
      const pending = await pendingMigrations(path, () => {
        return instance.connection('migrations');
      });

      if (pending.length) {
        throw new MigrationsPendingError(pending);
      }
    }
  }

  await Promise.all(
    Array
      .from(models.values())
      .map(model => {
        return model.initialize(instance, () => {
          return instance.connection(model.tableName);
        });
      })
  );

  return instance;
}
