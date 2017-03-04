// @flow
import EventEmitter from 'events';

import { createDefaultConfig } from '../config';
import * as responder from '../responder';
import merge from '../../utils/merge';
import tryCatch from '../../utils/try-catch';
import type Logger from '../logger';
import type Router from '../router';
import type Controller from '../controller';
import type Serializer from '../serializer';
import type { Config } from '../config';
import type { Adapter } from '../adapter';
import type { FreezeableMap } from '../freezeable';
import type Database, { Model, Config as DatabaseConfig } from '../database';

import initialize from './initialize';

export type Options = Config & {
  path: string;
  database: DatabaseConfig;
};

/**
 * @class Application
 * @public
 */
class Application extends EventEmitter {
  /**
   * The path of `Application` instance.
   *
   * @property path
   * @type {String}
   * @public
   */
  path: string;

  /**
   * @property adapter
   * @type {Adapter}
   * @private
   */
  adapter: Adapter;

  /**
   * A reference to the `Database` instance.
   *
   * @property store
   * @type {Database}
   * @private
   */
  store: Database;

  /**
   * A reference to the `Logger` instance.
   *
   * @property logger
   * @type {Logger}
   * @private
   */
  logger: Logger;

  /**
   * A reference to the `Router` instance.
   *
   * @property router
   * @type {Router}
   * @private
   */
  router: Router;

  /**
   * A map containing each `Model` class.
   *
   * @property models
   * @type {Map}
   * @private
   */
  models: FreezeableMap<string, Class<Model>>;

  /**
   * A map containing each `Controller` instance.
   *
   * @property controllers
   * @type {Map}
   * @private
   */
  controllers: FreezeableMap<string, Controller>;

  /**
   * A map containing each `Serializer` instance.
   *
   * @property serializers
   * @type {Map}
   * @private
   */
  serializers: FreezeableMap<string, Serializer<*>>;

  /**
   * @method constructor
   * @param {Object} config
   * @return {Promise}
   * @public
   */
  constructor(options: Options): Promise<Application> {
    super();
    return initialize(this, merge(createDefaultConfig(), options));
  }

  /**
   * @method exec
   * @private
   */
  exec(...args: Array<any>): Promise<void> {
    return tryCatch(async () => {
      const [request, response] = await this.adapter(...args);

      this.emit('request:start', request, response);

      const respond = responder.create(request, response);
      const route = this.router.match(request);

      if (route) {
        this.emit('request:match', request, response, route);

        const data = await route
          .visit(request, response)
          .catch(err => {
            this.emit('request:error', request, response, err);
          });

        respond(data);
        this.emit('request:complete', request, response);
      } else {
        respond(404);
        this.emit('request:complete', request, response);
      }
    }, err => {
      this.emit('error', err);
    });
  }

  /**
   * @method destroy
   * @private
   */
  async destroy(): Promise<void> {
    await this.store.connection.destroy();
  }
}

export default Application;
export type { Application$opts, Application$factoryOpts } from './interfaces';
