import getStaticPath from './utils/get-static-path';
import getDynamicSegments from './utils/get-dynamic-segments';

const { defineProperties } = Object;

class Route {
  path;
  action;
  method;
  resource;
  handlers;
  controller;
  staticPath;
  dynamicSegments;

  constructor({ path, action, controllers, method = 'GET', ...props }) {
    const resource = path.replace(/^(.+)\/.+$/ig, '$1');
    const controller = controllers.get(resource);
    const dynamicSegments = getDynamicSegments(path);
    let handlers;

    if (action && controller) {
      handlers = controller[action]();
    }

    defineProperties(this, {
      path: {
        value: path,
        writable: false,
        enumerable: true,
        configurable: false
      },

      action: {
        value: action,
        writable: false,
        enumerable: true,
        configurable: false
      },

      method: {
        value: method.toUpperCase(),
        writable: false,
        enumerable: true,
        configurable: false
      },

      resource: {
        value: resource,
        writable: false,
        enumerable: false,
        configurable: false
      },

      handlers: {
        value: handlers,
        writable: false,
        enumerable: false,
        configurable: false
      },

      controller: {
        value: controller,
        writable: false,
        enumerable: false,
        configurable: false
      },

      dynamicSegments: {
        value: dynamicSegments,
        writable: false,
        enumerable: false,
        configurable: false
      },

      staticPath: {
        value: getStaticPath(path, dynamicSegments),
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    return this;
  }
}

export default Route;
