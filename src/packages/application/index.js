import Promise from 'bluebird';
import cluster from 'cluster';
import { pluralize, singularize } from 'inflection';

import Server from '../server';
import Router from '../router';
import Database from '../database';

import loader from '../loader';

import {
  ControllerMissingError,
  SerializerMissingError
} from './errors';

const { defineProperties } = Object;

const { env: { PWD, PORT } } = process;
const { isMaster } = cluster;

class Application {
  path;
  port;
  store;
  domain;
  logger;
  router;

  constructor({
    path = PWD,
    port = PORT || 4000,
    domain = 'http://localhost',
    logger,
    sessionKey,
    sessionSecret
  } = {}) {
    const router = new Router();

    const server = new Server({
      router,
      logger,
      sessionKey,
      sessionSecret
    });

    const store = new Database({
      path,
      logger,
      config: require(`${path}/config/database`).default
    });

    defineProperties(this, {
      path: {
        value: path,
        writable: false,
        enumerable: true,
        configurable: false
      },

      port: {
        value: port,
        writable: false,
        enumerable: true,
        configurable: false
      },

      store: {
        value: store,
        writable: false,
        enumerable: true,
        configurable: false
      },

      domain: {
        value: domain,
        writable: false,
        enumerable: true,
        configurable: false
      },

      router: {
        value: router,
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

      server: {
        value: server,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    return this;
  }

  async boot() {
    const { router, domain, server, port, path, store } = this;

    let [
      routes,
      models,
      controllers,
      serializers
    ] = await Promise.all([
      loader(path, 'routes'),
      loader(path, 'models'),
      loader(path, 'controllers'),
      loader(path, 'serializers')
    ]);

    await store.define(models);

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
        domain,
        serializers
      });

      if (model) {
        model.serializer = serializer;
      }

      serializers.set(name, serializer);
    });

    let appController = controllers.get('application');
    appController = new appController({
      store,
      domain,
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
          domain,
          serializers,
          serializer: serializers.get(key),
          parentController: appController
        });

        controllers.set(key, controller);
      }
    });

    router.controllers = controllers;

    routes.get('routes').call(null, router.route, router.resource);

    server.listen(port);
    server.instance.once('listening', () => {
      if (isMaster) {
        process.emit('ready');
      } else {
        process.send('ready');
      }
    });

    return this;
  }
}

export default Application;
