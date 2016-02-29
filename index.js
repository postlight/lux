import fs from 'fs';

import Sequelize from 'sequelize';
import Promise, { promisifyAll } from 'bluebird';
import { singularize } from 'inflection';

import Base from './src/packages/base';
import Model from './src/packages/model';
import Server from './src/packages/server';
import Router from './src/packages/router';
import Container from './src/packages/container';

import loader from './src/packages/loader';

promisifyAll(fs);

class Framework extends Base {
  root = process.env.PWD;

  port = process.env.PORT || 4000;

  sessionKey = 'app::sess';

  sessionSecret = process.env.APP_SECRET || '1e71b30b17d2cef327b2625572d378a656de059ae24d69b2f1f7678bf6cf236d677d763b5819b1c5c5c2d31b3cdc9a5786ef1729abb05644d8b2cff30128fdab';

  enableCORS = false;

  environment = process.env.NODE_ENV || 'development';

  constructor() {
    super();

    const router = Router.create({
      enableCORS: this.enableCORS
    });

    const container = Container.create({
      application: this
    });

    container.register('router', 'main', router);

    this.setProps({
      container,
      router,

      server: Server.create({
        router,
        application: this
      })
    });

    return this;
  }

  async boot() {
    const { root, container } = this;
    const db = new Map();

    let dbConfig = JSON.parse(
      await fs.readFileAsync(`${root}/config/database.json`)
    );

    const {
      database,
      username,
      password,
      ...options
    } = dbConfig[this.environment];

    const sequelize = new Sequelize(database, username, password, options);

    container.register('store', 'main', db);

    db.set('Sequelize', Sequelize);
    db.set('sequelize', sequelize);

    let [
      routes,
      models,
      controllers,
      serializers
    ] = await Promise.all([
      loader('routes'),
      loader('models'),
      loader('controllers'),
      loader('serializers'),
    ]);

    for (let [key, model] of models) {
      let {
        name,
        indices,
        attributes,
        classMethods,
        instanceMethods,
        ...etc
      } = model;

      model = sequelize.define(name,
        {
          ...attributes,
          ...Model.attributes
        },
        {
          indexes: indices,
          defaultScope: Model.defaultScope,
          classMethods: {
            ...classMethods,
            ...Model.classMethods,
            registeredKey: key
          },
          instanceMethods: {
            ...instanceMethods,
            ...Model.instanceMethods
          },
          ...etc
        }
      );

      db.set(name, model);
      container.register('model', key, model);
    }

    await sequelize.sync();

    for (let model of db.values()) {
      if (model.associate) {
        model.associate(mapToObject(db));
      }
    }

    for (let [key, serializer] of serializers) {
      let model = container.lookup('model', singularize(key));

      serializer = serializer.create({
        model
      });

      container.register('serializer', key, serializer);
    }

    for (let [key, controller] of controllers) {
      let model = container.lookup('model', singularize(key));
      let serializer = container.lookup('serializer', key);

      controller = controller.create({
        model,
        serializer
      });

      container.register('controller', key, controller);
    }

    routes = routes[1];
    routes(this.router.route, this.router.resource);

    this.server.listen(this.port);
  }
}

export Base from './src/packages/base';
export Controller from './src/packages/controller';
export Serializer from './src/packages/serializer';
export Model, { DataTypes } from './src/packages/model';

export action from './src/packages/controller/decorators/action';

export default Framework;
