// @flow
import Database from '../database';
import Logger from '../logger';
import Router from '../router';
import { build, createLoader, closestChild } from '../loader';
import { freezeProps, deepFreezeProps } from '../freezeable';
import ControllerMissingError from '../../errors/controller-missing-error';

import createController from './utils/create-controller';
import createSerializer from './utils/create-serializer';

 // eslint-disable-next-line no-unused-vars
import type Application, { Options } from './index';

/**
 * @private
 */
export default async function initialize<T: Application>(app: T, {
  path,
  adapter,
  logging,
  database,
}: Options): Promise<T> {
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

  const serializers = build(
    load('serializers'),
    (key, value, parent) => createSerializer(value, {
      key,
      store,
      parent
    })
  );

  models.forEach(model => {
    Reflect.defineProperty(model, 'serializer', {
      value: closestChild(serializers, model.resourceName),
      writable: false,
      enumerable: false,
      configurable: false
    });
  });

  const controllers = build(
    load('controllers'),
    (key, value, parent) => createController(value, {
      key,
      store,
      parent,
      serializers
    })
  );

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

  Object.assign(app, {
    logger,
    models,
    controllers,
    serializers,
  });

  deepFreezeProps(app, true,
    'logger',
    'models',
    'controllers',
    'serializers'
  );

  Object.assign(app, {
    path,
    store,
    router,
    adapter: adapter(app),
  });

  freezeProps(app, false,
    'path',
    'port',
    'store',
    'router',
    'adapter'
  );

  return app;
}
