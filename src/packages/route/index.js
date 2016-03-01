import Base from '../base';

import memoize from '../../decorators/memoize';

class Route extends Base {
  constructor(props) {
    let { method } = props;

    method = (method || 'GET').toUpperCase();

    super({
      ...props,
      method
    });
  }

  @memoize
  get handlers() {
    const { controller, action } = this;

    if (controller) {
      return controller[action];
    }
  }

  @memoize
  get resource() {
    return this.path.replace(/^(.+)\/.+$/ig, '$1');
  }

  @memoize
  get controller() {
    return this.container.lookup('controller', this.resource);
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
