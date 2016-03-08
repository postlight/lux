import Promise, { promisifyAll } from 'bluebird';
import orm from 'orm';
import { underscore } from 'inflection';

import Base from '../base';
import { adapter } from '../model';

import omit from '../../utils/omit';
import camelizeKeys from '../../utils/camelize-keys';
import normalizePage from './utils/normalize-page';

const ormKey = Symbol('connection');

class Database extends Base {
  constructor(config = {}) {
    super();

    config = config[this.environment] || {};

    orm.settings.set('connection.pool', true);

    this.setProps({
      config: {
        host: '127.0.0.1',
        port: '3306',
        protocol: 'mysql',
        username: 'root',
        ...config
      }
    });

    return this;
  }

  define(name, model) {
    const connection = this[ormKey];
    const [attrs, options, classMethods] = model;

    model = connection.define(
      underscore(name).toLowerCase(),
      attrs,
      options
    );

    promisifyAll(model);

    for (let key in classMethods) {
      if (classMethods.hasOwnProperty(key)) {
        model[key] = classMethods[key];
      }
    }

    return this;
  }

  associate(type, relationshipType, key, relatedModelType, options) {
    const model = this.modelFor(type);
    const relatedModel = this.modelFor(relatedModelType);

    if (!model) {
      throw new Error();
    }

    if (!relatedModel) {
      throw new Error();
    }

    model[relationshipType].call(model, key, relatedModel, options);

    promisifyAll(model);
    promisifyAll(relatedModel);

    return this;
  }

  sync() {
    const connection = this[ormKey];

    return new Promise((resolve, reject) => {
      connection.sync(err => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      orm.connect(this.config, (err, connection) => {
        if (err) {
          reject(err);
        } else {
          this[ormKey] = connection;

          resolve(this);
        }
      });
    });
  }

  modelFor(type = '') {
    const connection = this[ormKey];

    return connection.models[type.replace(/-/g, '_')]
  }

  query(type, query = {}, options = {}) {
    const model = this.modelFor(type);
    let limit = 25;
    let offset = 0;

    if (!model) {
      throw new Error();
    }

    if (query.limit) {
      limit = parseInt(query.limit, 10);
    }

    if (query.page) {
      offset = limit * normalizePage(query.page);
    }

    query = omit(query, 'page', 'limit', 'include');

    return model.findAsync(query, {
      ...options,
      limit,
      offset
    });
  }

  count(type, query = {}, options = {}) {
    const model = this.modelFor(type);

    if (!model) {
      throw new Error();
    }

    return model.countAsync(query, options);
  }

  findRecord(type, id, options = {}) {
    const model = this.modelFor(type);

    if (!model) {
      throw new Error();
    }

    return model.getAsync(id, options);
  }

  queryRecord(type, query = {}, options = {}) {
    const model = this.modelFor(type);

    if (!model) {
      throw new Error();
    }

    return model.oneAsync(query, options);
  }

  createRecord(type, params) {
    const model = this.modelFor(type);

    if (!model) {
      throw new Error();
    }

    params = camelizeKeys(params.data.attributes);

    return model.createAsync({
      ...params,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

export default Database;
