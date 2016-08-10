// @flow
import { ModelMissingError } from './errors';

import Model from './model';

import initialize from './initialize';

import normalizeModelName from './utils/normalize-model-name';

import type Logger from '../logger';
import type { Database$opts } from './interfaces';

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

  models: Map<string, Class<Model>>;

  constructor({
    path,
    models,
    config,
    logger,
    checkMigrations
  }: Database$opts): Promise<Database> {
    return initialize(this, {
      path,
      models,
      config,
      logger,
      checkMigrations
    });
  }

  modelFor(type: string): Class<Model> {
    const model = this.models.get(normalizeModelName(type));

    if (!model) {
      throw new ModelMissingError(type);
    }

    return model;
  }
}

export default Database;
export { default as Model } from './model';
export { default as Query } from './query';
export { default as Migration, generateTimestamp } from './migration';
export { default as connect } from './utils/connect';
export { default as typeForColumn } from './utils/type-for-column';
export { default as createMigrations } from './utils/create-migrations';
export { default as pendingMigrations } from './utils/pending-migrations';

export type { Database$opts, Database$config } from './interfaces';
