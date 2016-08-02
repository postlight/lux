// @flow
import Route from '../../../route';

import type { Router$route } from '../interfaces';

/**
 * @private
 */
export default function defineRoute({ router, ...opts }: Router$route) {
  const route = new Route(opts);

  router.set(`${route.method}:/${route.staticPath}`, route);
}
