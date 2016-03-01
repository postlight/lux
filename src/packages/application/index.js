import Sequelize from 'sequelize';
import Promise from 'bluebird';
import { underscore, pluralize, singularize } from 'inflection';

import Base from '../base';
import Model from '../model';
import Server from '../server';
import Router from '../router';
import Logger from '../logger';
import Container from '../container';

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
    const container = Container.create({
      application: this
    });

    container.register('router', 'main', router);
    container.register('logger', 'main', logger);

    this.setProps({
      container,

      server: Server.create({
        router,
        logger,
        application: this
      })
    });

    return this;
  }

  async boot() {
    const { root, container } = this;
    const db = new Map();

    await this.createLogFile();

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
      loader('serializers')
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

      for (let attrKey in attributes) {
        let attr = attributes[attrKey];

        attributes[attrKey] = {
          ...attr,
          field: underscore(attrKey)
        };
      }

      model = sequelize.define(name,
        {
          ...attributes,
          ...Model.attributes
        },
        {
          indexes: indices,
          tableName: pluralize(underscore(name)),
          underscored: true,
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
