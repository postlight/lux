// @flow
import initialize from './initialize';
import { createDefaultConfig } from '../config';
import merge from '../../utils/merge';

import type Logger from '../logger';
import type Router from '../router';
import type Server from '../server';
import type Controller from '../controller';
import type Serializer from '../serializer';
import type Database, { Model } from '../database';
import type { Application$opts } from './interfaces';

/**
 * The `Application` class is responsible for constructing an application and
 * putting all the moving parts (`Model`, `Controller`, `Serializer`) together.
 *
 * @module lux-framework
 * @namespace Lux
 * @class Application
 * @constructor
 * @public
 */
class Application {
  path: string;

  port: number;

  store: Database;

  models: Map<string, Class<Model>>;

  logger: Logger;

  controllers: Map<string, Controller>;

  serializers: Map<string, Serializer<*>>;

  router: Router;

  server: Server;

  /**
   * @method constructor
   * @param {Object} config
   * @return {Promise}
   */
  constructor(opts: Application$opts): Promise<Application> {
    return initialize(this, merge(createDefaultConfig(), opts));
  }
}

export default Application;

export type { Application$opts, Application$factoryOpts } from './interfaces';
