import Promise from 'bluebird';
import { underscore, pluralize, singularize } from 'inflection';

import Base from '../base';
import Model, { adapter } from '../model';
import Server from '../server';
import Router from '../router';
import Logger from '../logger';
import Database from '../database';

import fs from '../fs';
import loader from '../loader';

class Application extends Base {
  router = Router.create();

  logger = Logger.create();

  sessionKey = 'app::sess';

  sessionSecret = process.env.APP_SECRET || '1e71b30b17d2cef327b2625572d378a656de059ae24d69b2f1f7678bf6cf236d677d763b5819b1c5c5c2d31b3cdc9a5786ef1729abb05644d8b2cff30128fdab';

  constructor(props) {
    super(props);

    const { router, logger } = this;

    this.setProps({
      server: Server.create({
        router,
        logger,
        application: this
      })
    });

    return this;
  }

  async boot() {
    const { root, router } = this;

    await this.createLogFile();

    const store = Database.create(
      JSON.parse(
        await fs.readFileAsync(`${root}/config/database.json`)
      )
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

    for (let [key, model] of models) {
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
      let [attrs, options, classMethods, hasOne, hasMany] = adapter(model);

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
      serializers.set(key, serializer.create());
    }

    for (let serializer of serializers.values()) {
      serializer.serializers = serializers;
    }

    const appController = controllers.get('application').create({
      store,
      serializer: serializers.get('application')
    });

    controllers.set('application', appController);

    for (let [key, controller] of controllers) {
      if (key === 'application') {
        continue;
      }

      controller = controller.create({
        store,
        serializer: serializers.get(key),
        parentController: appController
      });

      controllers.set(key, controller);
    }

    router.controllers = controllers;

    routes.get('routes').call(null, router.route, router.resource);

    this.server.listen(this.port);

    return this;
  }

  async createLogFile() {
    const { root, environment } = this;

    try {
      await fs.mkdirAsync(`${root}/log`);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }

    try {
      await fs.accessAsync(`${root}/log/${environment}.log`);
    } catch (err) {
      await fs.writeFileAsync(`${root}/log/${environment}.log`, '', 'utf8');
    }
  }
}

export default Application;
