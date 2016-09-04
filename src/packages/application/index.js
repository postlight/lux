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
 */
class Application {
  /**
   * An absolute path to the root directory of the `Application` instance.
   *
   * @example
   * '/projects/my-app'
   *
   * @property path
   * @memberof Application
   * @instance
   * @readonly
   */
  path: string;

  /**
   * The port that the `Application` instance will listen for connections.
   *
   * @property port
   * @memberof Application
   * @instance
   * @readonly
   */
  port: number;

  /**
   * A reference to the instance of `Database`.
   *
   * @property store
   * @memberof Application
   * @instance
   * @readonly
   * @private
   */
  store: Database;

  /**
   * A map containing each `Model` class in an application instance.
   *
   * @property models
   * @memberof Application
   * @instance
   * @readonly
   */
  models: Map<string, Class<Model>>;

  /**
   * A reference to the instance of `Logger`.
   *
   * @property logger
   * @memberof Application
   * @instance
   * @readonly
   */
  logger: Logger;

  /**
   * A map containing each `Controller` class in an application instance.
   *
   * @property controllers
   * @memberof Application
   * @instance
   * @readonly
   */
  controllers: Map<string, Controller>;

  /**
   * A map containing each `Serializer` class in an application instance.
   *
   * @property serializers
   * @memberof Application
   * @instance
   * @readonly
   */
  serializers: Map<string, Serializer<*>>;

  /**
   * A reference to the instance of `Router`.
   *
   * @property logger
   * @memberof Application
   * @instance
   * @readonly
   * @private
   */
  router: Router;

  /**
   * A reference to the instance of `Server`.
   *
   * @property server
   * @memberof Application
   * @instance
   * @readonly
   * @private
   */
  server: Server;

  /**
   * Create an instance of `Application`.
   *
   * WARNING:
   * It is highly reccomended that you do not override this method.
   */
  constructor(opts: Application$opts): Promise<Application> {
    return initialize(this, merge(createDefaultConfig(), opts));
  }
}

export default Application;

export type { Application$opts, Application$factoryOpts } from './interfaces';
