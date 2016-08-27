// @flow
import { LUX_CONSOLE } from '../../constants';

import Database from '../database';
import Logger from '../logger';
import Router from '../router';
import Server from '../server';
import { build, createLoader } from '../loader';
import { freezeProps } from '../freezeable';

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

  Object.assign(app, {
    logger,
    models,
    controllers,
    serializers
  });

  freezeProps(app, true,
    'logger',
    'models',
    'controllers',
    'serializers'
  );

  Object.assign(app, {
    path,
    port,
    store,
    router,
    server
  });

  freezeProps(app, false,
    'path',
    'port',
    'store',
    'router',
    'server'
  );

  return Object.freeze(app);
}
