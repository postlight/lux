import Promise from 'bluebird';

import Base from '../base';
import Model, { adapter } from '../model';
import Server from '../server';
import Router from '../router';
import Database from '../database';

import loader from '../loader';

const { keys } = Object;

class Application extends Base {
  router = Router.create();

  constructor(props) {
    super(props);

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
    const { root, router, domain, server, port } = this;
    const store = Database.create(
      require(`${root}/config/database`).default
    );

    await store.connect();

    let [
      routes,
      models,
      controllers,
      serializers
    ] = await Promise.all([
      loader('routes'),
      loader('models'),
      loader('controllers'),
      loader('serializers')
    ]);

    for (let model of models.values()) {
      let [attributes, options, classMethods] = adapter(model);

      store.define(model.name, [
        {
          ...Model.attributes,
          ...attributes
        },

        options,
        classMethods
      ]);
    }

    for (let [key, model] of models) {
      let [ , , , hasOne, hasMany] = adapter(model);

      for (let relatedKey in hasOne) {
        if (hasOne.hasOwnProperty(relatedKey)) {
          let relationship = hasOne[relatedKey];

          store.associate(key, 'hasOne', ...relationship);
        }
      }

      for (let relatedKey in hasMany) {
        if (hasMany.hasOwnProperty(relatedKey)) {
          let relationship = hasMany[relatedKey];

          store.associate(key, 'hasMany', ...relationship);
        }
      }
    }

    await store.sync();

    for (let [key, serializer] of serializers) {
      serializer = serializer.create({
        domain
      });

      serializers.set(key, serializer);
    }

    for (let serializer of serializers.values()) {
      serializer.serializers = serializers;
    }

    const appController = controllers.get('application').create({
      store,
      serializers,
      serializer: serializers.get('application')
    });

    controllers.set('application', appController);

    for (let [key, controller] of controllers) {
      if (key === 'application') {
        continue;
      }

      controller = controller.create({
        store,
        domain,
        serializers,
        serializer: serializers.get(key),
        parentController: appController
      });

      let model = store.modelFor(controller.modelName);

      if (model && !controller.sort.length) {
        controller.sort = keys(model.properties);
      }

      if (model && !controller.filter.length) {
        controller.filter = keys(model.properties);
      }

      controllers.set(key, controller);
    }

    router.controllers = controllers;

    routes.get('routes').call(null, router.route, router.resource);

    server.instance.once('listening', () => process.send('ready'));
    server.listen(port);

    return this;
  }
}

export default Application;
