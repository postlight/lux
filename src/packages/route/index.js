import Base from '../base';

import getStaticPath from './utils/get-static-path';
import getDynamicSegments from './utils/get-dynamic-segments';

class Route extends Base {
  path;
  method;
  action;
  resource;
  controller;
  staticPath;
  dynamicSegments;

  constructor({ path, action, controllers, method = 'GET', ...props }) {
    const resource = path.replace(/^(.+)\/.+$/ig, '$1');
    const controller = controllers.get(resource);
    const dynamicSegments = getDynamicSegments(path);

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
      dynamicSegments,
      method: method.toUpperCase(),
      staticPath: getStaticPath(path, dynamicSegments)
    });
  }
}

export default Route;
