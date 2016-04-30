import Base from '../base';

import memoize from '../../decorators/memoize';

class Route extends Base {
  path;
  method;
  action;
  resource;
  controller;

  constructor({ path, action, controllers, method = 'GET', ...props }) {
    const resource = path.replace(/^(.+)\/.+$/ig, '$1');
    const controller = controllers.get(resource);

    if (action && controller) {
      props = {
        ...props,
        handlers: controller[action]()
      };
    }

    return super({
      ...props,
      path,
      action,
      resource,
      controller,
      method: method.toUpperCase()
    });
  }

  @memoize
  get staticPath() {
    const { path, dynamicSegments } = this;
    let staticPath = path;

    if (dynamicSegments.length) {
      const pattern = new RegExp(`(${dynamicSegments.join('|')})`, 'g');

      staticPath = path.replace(pattern, 'dynamic');
    }

    return staticPath;
  }

  @memoize
  get dynamicSegments() {
    return (this.path.match(/(:\w+)/g) || []).map(part => part.substr(1));
  }
}

export default Route;
