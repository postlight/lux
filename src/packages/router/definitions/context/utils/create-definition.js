// @flow
import { Route } from '../../../index';
import { normalizeName, normalizePath } from '../../../namespace';

import type { Request$method } from '../../../../server';
import type { Router$Namespace, Route$type } from '../../../index';

/**
 * @private
 */
export default function createDefinition({ type, method, namespace }: {
  type: Route$type;
  method: Request$method;
  namespace: Router$Namespace;
}) {
  return function define(name: string, action?: string) {
    const { controller } = namespace;
    let { path } = namespace;

    name = normalizeName(name);

    if (!action) {
      action = name;
    }

    if (type === 'member') {
      path += `/:id/${name}`;
    } else {
      path += `/${name}`;
    }

    path = normalizePath(path);

    const opts = {
      type,
      path,
      action,
      method,
      controller
    };

    namespace
      .add(new Route(opts))
      .add(new Route({
        ...opts,
        type: 'custom',
        method: 'HEAD',
        action: 'preflight'
      }))
      .add(new Route({
        ...opts,
        type: 'custom',
        method: 'OPTIONS',
        action: 'preflight'
      }));
  };
}
