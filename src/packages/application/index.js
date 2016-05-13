import Promise from 'bluebird';
import cluster from 'cluster';
import { singularize } from 'inflection';

import Base from '../base';
import Server from '../server';
import Router from '../router';
import Database from '../database';

import loader from '../loader';

const { isMaster } = cluster;

class Application extends Base {
  path;

  router = Router.create();

  constructor({ path = process.env.PWD, ...props }) {
    super({
      ...props,
      path
    });

    this.setProps({
      server: Server.create({
        router: this.router,
        logger: this.logger,
        application: this
      })
    });

    return this;
  }

  async boot() {
    const { router, logger, domain, server, port, path } = this;

    const store = new Database({
      path,
      logger,
      config: require(`${path}/config/database`).default
    });

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

    serializers.forEach((serializer, name) => {
      const model = models.get(singularize(name));

      serializer = serializer.create({
        model,
        domain
      });

      if (model) {
        model.serializer = serializer;
      }

      serializers.set(name, serializer);
    });

    serializers.forEach(serializer => {
      serializer.serializers = serializers;
    });

    const appController = controllers.get('application').create({
      store,
      domain,
      serializers,
      serializer: serializers.get('application')
    });

    controllers.set('application', appController);

    controllers.forEach((controller, key) => {
      if (key !== 'application') {
        const model = store.modelFor(singularize(key));

        controller = controller.create({
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
