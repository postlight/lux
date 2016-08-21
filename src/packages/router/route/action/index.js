// @flow
import resource from './enhancers/resource';
import trackPerf from './enhancers/track-perf';

import type Controller from '../../../controller';
import type { Action } from './interfaces';

/**
 * @private
 */
export function createAction(
  type: string,
  action: Action<any>,
  controller: Controller
): Array<Action<any>> {
  if (type !== 'custom' && controller.hasModel && controller.hasSerializer) {
    action = resource(action);
  }

  function __FINAL__HANDLER__(req, res) {
    return action(req, res);
  }

  return [...controller.middleware, __FINAL__HANDLER__].map(trackPerf);
}

export { default as createPageLinks } from './utils/create-page-links';

export type { Action } from './interfaces';
