import Base from '../base';

import formatInclude from './utils/format-include';
import createPageLinks from './utils/create-page-links';

import memoize from '../../decorators/memoize';
import action from './decorators/action';

class Controller extends Base {
  store;
  model;
  domain;
  modelName;
  middleware;
  attributes;
  serializer;
  serializers;

  sort = [];
  filter = [];
  params = [];
  beforeAction = [];
  defaultPerPage = 25;

  constructor({ model, serializer, parentController, ...props }) {
    let attributes = [];

    super();

    if (model) {
      props = {
        ...props,
        model,
        modelName: model.modelName
      };

      attributes = model.attributeNames;

      if (!this.sort.length) {
        props.sort = attributes;
      }

      if (!this.filter.length) {
        props.filter = attributes;
      }
    }

    if (serializer) {
      props = {
        ...props,
        serializer,
        attributes: ['id', ...serializer.attributes]
          .filter(attr => {
            return attributes.indexOf(attr) >= 0;
          })
      };
    }

    if (parentController) {
      props = {
        ...props,
        parentController,
        middleware: [
          ...parentController.middleware,
          ...this.beforeAction
        ]
      };
    } else {
      props = {
        ...props,
        middleware: this.beforeAction
      };
    }

    this.setProps(props);

    return this;
  }

  @memoize
  get relationships() {
    const { serializer } = this;

    return [
      ...serializer.hasOne,
      ...serializer.hasMany
    ];
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
    return true;
  }
}

export action from './decorators/action';
export default Controller;
