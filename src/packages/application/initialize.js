// @flow
import { LUX_CONSOLE } from '../../constants';

import Database from '../database';
import Logger from '../logger';
import Router from '../router';
import Server from '../server';
import { build, createLoader } from '../loader';

import { ControllerMissingError } from './errors';

import createController from './utils/create-controller';
import createSerializer from './utils/create-serializer';

import type Application, { Application$opts } from './index'; // eslint-disable-line no-unused-vars, max-len

/**
 * @private
 */
export default async function initialize<T: Application>(app: T, {
  path,
  port,
  logging,
  database,
  server: serverConfig
}: Application$opts): Promise<T> {
  const load = createLoader(path);
  const routes = load('routes');
  const models = load('models');

  const logger = new Logger(logging);

  const store = await new Database({
    path,
    models,
    logger,
    config: database,
    checkMigrations: true
  });

  port = parseInt(port, 10);

  const serializers = build(load('serializers'), (key, value, parent) => {
    return createSerializer(value, {
      key,
      store,
      parent
    });
  });

  models.forEach(model => {
    Reflect.defineProperty(model, 'serializer', {
      value: serializers.get(model.resourceName),
      writable: false,
      enumerable: false,
      configurable: false
    });
  });

  const controllers = build(load('controllers'), (key, value, parent) => {
    return createController(value, {
      key,
      store,
      parent,
      serializers
    });
  });

  controllers.forEach(controller => {
    Reflect.defineProperty(controller, 'controllers', {
      value: controllers,
      writable: true,
      enumerable: false,
      configurable: false
    });
  });

  const ApplicationController = controllers.get('application');

  if (!ApplicationController) {
    throw new ControllerMissingError('application');
  }

  const router = new Router({
    routes,
    controllers,
    controller: ApplicationController
  });

  const server = new Server({
    router,
    logger,
    ...serverConfig
  });

  if (!LUX_CONSOLE) {
    server.instance.listen(port).once('listening', () => {
      if (typeof process.send === 'function') {
        process.send('ready');
      } else {
        process.emit('ready');
      }
    });
  }

  Object.defineProperties(app, {
    models: {
      value: models,
      writable: false,
      enumerable: true,
      configurable: false
    },

    controllers: {
      value: controllers,
      writable: false,
      enumerable: true,
      configurable: false
    },

    serializers: {
      value: serializers,
      writable: false,
      enumerable: true,
      configurable: false
    },

    logger: {
      value: logger,
      writable: false,
      enumerable: true,
      configurable: false
    },

    path: {
      value: path,
      writable: false,
      enumerable: false,
      configurable: false
    },

    port: {
      value: port,
      writable: false,
      enumerable: false,
      configurable: false
    },

    store: {
      value: store,
      writable: false,
      enumerable: false,
      configurable: false
    },

    router: {
      value: router,
      writable: false,
      enumerable: false,
      configurable: false
    },

    server: {
      value: server,
      writable: false,
      enumerable: false,
      configurable: false
    }
  });

  Object.freeze(app);
  Object.freeze(store);
  Object.freeze(logger);
  Object.freeze(router);
  Object.freeze(server);

  models.forEach(Object.freeze);
  controllers.forEach(Object.freeze);
  serializers.forEach(Object.freeze);

  models.freeze();
  controllers.freeze();
  serializers.freeze();

  return app;
}
