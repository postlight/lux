// @flow
import { IS_PRODUCTION } from '../../../../constants';
import insert from '../../../../utils/insert';
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
  controller: Controller<*>
): Array<Action<any>> {
  let controllerAction = action.bind(controller);

  if (type !== 'custom' && controller.hasModel && controller.hasSerializer) {
    controllerAction = resource(controllerAction);
  }

  let handlers = [
    ...controller.beforeAction,
    controllerAction,
    ...controller.afterAction
  ];

  if (!IS_PRODUCTION) {
    handlers = handlers.map(trackPerf);
  }

  return insert(new Array(handlers.length), handlers);
}

export { default as createPageLinks } from './utils/create-page-links';
export type { Action } from './interfaces';
