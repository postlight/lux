import Promise from 'bluebird';

import formatInclude from './utils/format-include';
import createPageLinks from './utils/create-page-links';

import action from './decorators/action';

const { isArray } = Array;
const { defineProperties } = Object;

class Controller {
  store;
  model;
  domain;
  modelName;
  middleware;
  attributes;
  serializer;
  serializers;
  parentController;

  params = [];
  beforeAction = [];
  defaultPerPage = 25;

  _sort = [];
  _filter = [];

  constructor({
    store,
    model,
    domain,
    serializer,
    serializers = new Map(),
    parentController
  }) {
    let attributes = [];
    let relationships = [];

    if (model && serializer) {
      const { primaryKey, attributeNames, relationshipNames } = model;
      const { attributes: serializedAttributes } = serializer;
      const serializedRelationships = [
        ...serializer.hasOne,
        ...serializer.hasMany
      ];

      attributes = attributeNames.filter(attr => {
        return attr === primaryKey || serializedAttributes.indexOf(attr) >= 0;
      });

      relationships = relationshipNames.filter(relationship => {
        return serializedRelationships.indexOf(relationship) >= 0;
      });
    }

    defineProperties(this, {
      model: {
        value: model,
        writable: false,
        enumerable: true,
        configurable: false
      },

      serializer: {
        value: serializer,
        writable: false,
        enumerable: true,
        configurable: false
      },

      store: {
        value: store,
        writable: false,
        enumerable: false,
        configurable: false
      },

      domain: {
        value: domain,
        writable: false,
        enumerable: false,
        configurable: false
      },

      modelName: {
        value: model ? model.modelName : null,
        writable: false,
        enumerable: false,
        configurable: false
      },

      attributes: {
        value: attributes,
        writable: false,
        enumerable: false,
        configurable: false
      },

      relationships: {
        value: relationships,
        writable: false,
        enumerable: false,
        configurable: false
      },

      serializers: {
        value: serializers,
        writable: false,
        enumerable: false,
        configurable: false
      },

      parentController: {
        value: parentController,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    return this;
  }

  get sort() {
    const { attributes, _sort: sort } = this;

    return sort.length ? sort : attributes;
  }

  set sort(value = []) {
    if (isArray(value)) {
      this._sort = value;
    }
  }

  get filter() {
    const { attributes, _filter: filter } = this;

    return filter.length ? filter : attributes;
  }

  set filter(value = []) {
    if (isArray(value)) {
      this._filter = value;
    }
  }

  get middleware() {
    const { beforeAction, parentController } = this;

    if (parentController) {
      return [
        ...parentController.middleware,
        ...beforeAction
      ];
    } else {
      return beforeAction;
    }
  }

  @action
  async index(req) {
    const { url, params } = req;
    const { model, domain, relationships } = this;

    let {
      page,
      limit,
      include = [],
      sort: order,
      filter: where,
      fields: {
        [model.modelName]: select,
        ...includedFields
      }
    } = params;

    if (!limit) {
      limit = this.defaultPerPage;
    }

    if (!select) {
      select = this.attributes;
    }

    include = formatInclude(model, include, includedFields, relationships);

    const [count, data] = await Promise.all([
      model.count(where),

      model.findAll({
        page,
        limit,
        where,
        order,
        select,
        include
      })
    ]);

    return {
      data,

      links: {
        self: domain + url.path,
        ...createPageLinks(domain, url.pathname, { ...params, limit }, count)
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
    const { domain, model } = this;

    const {
      url: {
        pathname
      },

      params: {
        data: {
          attributes,
          // relationships
        }
      }
    } = req;

    return {
      data: await model.create(attributes),

      links: {
        self: domain + pathname
      }
    };
  }

  @action
  async update(req) {
    const { domain } = this;

    const {
      record: data,

      url: {
        pathname
      },

      params: {
        data: {
          attributes,
          // relationships
        }
      }
    } = req;

    let links;

    if (data) {
      links = { self: domain + pathname };
      await data.update(attributes);
    }

    return {
      data,
      links
    };
  }

  @action
  async destroy(req) {
    const { domain } = this;
    const { url: { pathname }, record: data } = req;
    let links;

    if (data) {
      links = { self: domain + pathname };
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
