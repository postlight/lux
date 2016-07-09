// @flow
import { pluralize, singularize } from 'inflection';

import { LUX_CONSOLE } from '../../constants';

import Database from '../database';
import Logger from '../logger';
import Router from '../router';
import Server from '../server';
import loader from '../loader';

import {
  ControllerMissingError,
  SerializerMissingError
} from './errors';

import type Application from './index';

/**
 * @private
 */
export default async function initialize(app: Application, {
  log,
  path,
  port,
  database
}: {
  log: boolean,
  path: string,
  port: number,
  database: {}
} = {}): Promise<Application> {
  const routes = loader(path, 'routes');
  const models = loader(path, 'models');
  const controllers = loader(path, 'controllers');
  const serializers = loader(path, 'serializers');

  const logger = await new Logger({
    path,
    enabled: log
  });

  const store = await new Database({
    path,
    models,
    logger,
    config: database,
    checkMigrations: true
  });

  port = parseInt(port, 10);

  models.forEach((model, name) => {
    const resource = pluralize(name);

    if (!controllers.get(resource)) {
      throw new ControllerMissingError(resource);
    }

    if (!serializers.get(resource)) {
      throw new SerializerMissingError(resource);
    }
  });

  serializers.forEach((serializer, name) => {
    const model = models.get(singularize(name));

    serializer = new serializer({
      model,
      serializers
    });

    if (model) {
      Reflect.defineProperty(model, 'serializer', {
        value: serializer,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }

    serializers.set(name, serializer);
  });

  let appController = controllers.get('application');
  appController = new appController({
    store,
    serializers,
    serializer: serializers.get('application')
  });

  controllers.set('application', appController);

  controllers.forEach((controller, key) => {
    if (key !== 'application') {
      const model = store.modelFor(singularize(key));

      controller = new controller({
        store,
        model,
        serializers,
        serializer: serializers.get(key),
        parentController: appController
      });

      controllers.set(key, controller);
    }
  });

  const router = new Router({
    routes,
    controllers
  });

  const server = new Server({
    router,
    logger
  });

  if (!LUX_CONSOLE) {
    server.instance.listen(port).once('listening', () => {
      if (typeof process.send === 'function') {
        process.send({
          message: 'ready'
        });
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

  return app;
}
