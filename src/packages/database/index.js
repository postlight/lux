// @flow
import { ModelMissingError } from './errors';

import Model from './model';

import initialize from './initialize';

import type Logger from '../logger';

/**
 * @private
 */
class Database {
  path: string;

  debug: boolean;

  logger: Logger;

  config: Object;

  schema: Function;

  connection: any;

  models: Map<string, typeof Model>;

  constructor({
    path,
    models,
    config,
    logger,
    checkMigrations
  }: {
    path: string,
    models: Map<string, typeof Model>,
    config: Object,
    logger: Logger,
    checkMigrations: boolean
  } = {}): Promise<Database> {
    return initialize(this, {
      path,
      models,
      config,
      logger,
      checkMigrations
    });
  }

  modelFor(type: string): typeof Model  {
    const model: typeof Model = this.models.get(type);

    if (!model) {
      throw new ModelMissingError(type);
    }

    return model;
  }
}

export { default as connect } from './utils/connect';
export { default as createMigrations } from './utils/create-migrations';
export { default as pendingMigrations } from './utils/pending-migrations';

export { default as Model } from './model';
export { default as Query } from './query';
export { default as Migration } from './migration';
export default Database;
