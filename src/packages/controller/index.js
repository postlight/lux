import Base from '../base';

import memoize from '../../decorators/memoize';
import action from './decorators/action';

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
