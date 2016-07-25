// @flow
import Route from '../../../route';

import type { options } from '../interfaces';

/**
 * @private
 */
export default function defineRoute({ router, ...opts }: options): void {
  const route = new Route(opts);

  router.set(`${route.method}:/${route.staticPath}`, route);
}
