import Promise from 'bluebird';
import { singularize, underscore, dasherize } from 'inflection';

import Base from '../base';

import camelizeKeys from '../../utils/camelize-keys';

import memoize from '../../decorators/memoize';
import action from './decorators/action';

const { assign } = Object;

class Controller extends Base {
  params = [];

  beforeAction = [];

  sanitizeParams = true;

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
      middleware = [...parent.beforeAction, ...middleware];
    }

    return middleware;
  }

  @memoize
  get serializedAttributes() {
    let { serializer } = this;

    if (serializer) {
      return serializer.attributes;
    }
  }

  @action
  index(req) {
    return this.store.query(this.modelName, req.params, {
      select: this.serializedAttributes
    });
  }

  @action
  show(req) {
    return req.record;
  }

  @action
  create(req) {
    return this.store.createRecord(this.modelName, req.params);
  }

  @action
  async update(req) {
    if (req.record) {
      const params = camelizeKeys(req.params.data.attributes || {});

      return await req.record.update(params);
    }
  }

  @action
  async destroy(req) {
    if (req.record) {
      return await req.record.destroy();
    }
  }

  @action
  preflight() {
    return true;
  }
}

export action from './decorators/action';

export default Controller;
