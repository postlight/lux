// @flow
import defineRoute from './define-route';
import type { options } from '../interfaces';

export default function defineResource({
  path,
  router,
  controllers
}: {
  path: options.path;
  router: options.router;
  controllers: options.controllers;
}): void {
  defineRoute({
    path,
    router,
    controllers,
    method: 'GET',
    action: 'index'
  });

  defineRoute({
    router,
    controllers,
    path: `${path}/:id`,
    method: 'GET',
    action: 'show'
  });

  defineRoute({
    path,
    router,
    controllers,
    method: 'POST',
    action: 'create'
  });

  defineRoute({
    router,
    controllers,
    path: `${path}/:id`,
    method: 'PATCH',
    action: 'update'
  });

  defineRoute({
    router,
    controllers,
    path: `${path}/:id`,
    method: 'DELETE',
    action: 'destroy'
  });

  defineRoute({
    path,
    router,
    controllers,
    method: 'HEAD',
    action: 'preflight'
  });

  defineRoute({
    router,
    controllers,
    path: `${path}/:id`,
    method: 'HEAD',
    action: 'preflight'
  });

  defineRoute({
    path,
    router,
    controllers,
    method: 'OPTIONS',
    action: 'preflight'
  });

  defineRoute({
    router,
    controllers,
    path: `${path}/:id`,
    method: 'OPTIONS',
    action: 'preflight'
  });
}
