import { camelize, capitalize, classify, singularize } from 'inflection';

import Base from '../base';

import flatten from '../../utils/flatten';

import memoize from '../../decorators/memoize';
import action from './decorators/action';

const { keys } = Object;

class Controller extends Base {
  params = [];

  beforeAction = [];

  sanitizeParams = true;

  @memoize
  get middleware() {
    const parent = this.parentController;
    let middleware = this.beforeAction;

    if (parent) {
      middleware = [...parent.beforeAction, ...middleware];
    }

    return middleware;
  }

  @memoize
  get parentController() {
    let parent = this.container.lookup('controller', 'application');

    if (parent !== this) {
      return parent;
    }
  }

  @memoize
  get include() {
    const { serializer } = this;

    if (serializer) {
      return flatten([
        serializer.hasOne,
        serializer.hasMany
      ]).map(related => {
        const name = singularize(classify(related.replace('-', '_')));

        return {
          model: this.db[name],
          as: camelize(related),
          attributes: ['id']
        };
      });
    }
  }

  @memoize
  get serializedAttributes() {
    let attrs;
    const { model, serializer } = this;

    if (model) {
      attrs = keys(model.attributes);

      if (serializer) {
        attrs = flatten([
          'id',
          serializer.attributes,
          serializer.hasOne
            .map(related => `${capitalize(related)}Id`)
            .filter(related => attrs.includes(related))
        ]);
      }
    }

    return attrs;
  }

  @action
  index(req) {
    return this.model.query({
      ...req.params,
      include: this.include,
      attributes: this.serializedAttributes
    });
  }

  @action
  show(req) {
    return req.record;
  }

  @action
  create(req) {
    return this.model.createRecord(req.params);
  }

  @action
  update(req) {
    if (req.record) {
      return req.record.updateRecord(req.params);
    }
  }

  @action
  async destroy(req) {
    if (req.record) {
      await req.record.destroyRecord();
      return req.record;
    }
  }

  @action
  preflight() {
    return true;
  }
}

export action from './decorators/action';

export default Controller;
