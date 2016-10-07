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

  // eslint-disable-next-line no-underscore-dangle
  function __FINAL__HANDLER__(req, res) {
    return fn(req, res);
  }

  return [...controller.beforeAction, __FINAL__HANDLER__].map(trackPerf);
}

export { default as createPageLinks } from './utils/create-page-links';

export type { Action } from './interfaces';
