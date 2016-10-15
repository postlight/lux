// @flow
import type Controller from '../../../controller';

import resource from './enhancers/resource';
import trackPerf from './enhancers/track-perf';
import type { Action } from './interfaces';

/**
 * @private
 */
export function createAction(
  type: string,
  action: Action<any>,
  controller: Controller
): Array<Action<any>> {
  let fn = action.bind(controller);

  if (type !== 'custom' && controller.hasModel && controller.hasSerializer) {
    fn = resource(fn);
  }

  return [
    ...controller.beforeAction,
    // eslint-disable-next-line no-underscore-dangle
    function __FINAL_HANDLER__(req, res) {
      return fn(req, res);
    },
    ...controller.afterAction,
  ].map(trackPerf);
}

export { FINAL_HANDLER } from './constants';
export { default as createPageLinks } from './utils/create-page-links';

export type { Action } from './interfaces';
