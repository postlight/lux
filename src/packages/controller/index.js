import Promise from 'bluebird';
import { singularize, underscore, dasherize } from 'inflection';

import Base from '../base';

import createPageLinks from './utils/create-page-links';

import memoize from '../../decorators/memoize';
import action from './decorators/action';

class Controller extends Base {
  sort = [];

  filter = [];

  params = [];

  beforeAction = [];

  @memoize
  get modelName() {
    const { name } = this.constructor;

    return dasherize(
      underscore(
        singularize(
          name.substr(0, name.length - 10)
        )
      )
    );
  }

  @memoize
  get middleware() {
    const parent = this.parentController;
    let middleware = this.beforeAction;

    if (parent) {
      middleware = [
        ...parent.beforeAction,
        ...middleware
      ];
    }

    return middleware;
  }

  @memoize
  get serializedAttributes() {
    const { serializer } = this;

    if (serializer) {
      return [
        'id',
        ...serializer.attributes.map(str => underscore(str)),
        ...serializer.hasOne.map(str => `${underscore(str)}_id`)
      ];
    }
  }

  @action
  async index(req) {
    const { url, params } = req;
    const { store, domain, modelName } = this;
    let only = params.fields[modelName];

    if (!only) {
      only = this.serializedAttributes;
    }

    const [data, count] = await Promise.all([
      store.query(modelName, params, { only }),
      store.count(modelName, params)
    ]);

    return {
      data,

      links: {
        self: domain + url.path,
        ...createPageLinks(domain, url.pathname, params, count)
      }
    };
  }

  @action
  show(req) {
    let { url, record: data } = req;
    let links;

    if (data) {
      links = { self: this.domain + url.path };
    }

    return {
      data,
      links
    };
  }

  @action
  async create(req) {
    const { url, params } = req;
    const data = await this.store.createRecord(
      this.modelName,
      params.data.attributes
    );

    return {
      data,

      links: {
        self: this.domain + url.pathname
      }
    };
  }

  @action
  async update(req) {
    const { url, params } = req;
    let links;
    let data = req.record;

    if (data) {
      links = { self: this.domain + url.pathname };
      data = await data.update(params.data.attributes);
    }

    return {
      data,
      links
    };
  }

  @action
  async destroy(req) {
    const { url, record: data } = req;
    let links;

    if (data) {
      links = { self: this.domain + url.pathname };
      await data.destroy();
    }

    return {
      data,
      links
    };
  }

  @action
  preflight() {
    return {
      data: true
    };
  }
}

export action from './decorators/action';

export default Controller;
