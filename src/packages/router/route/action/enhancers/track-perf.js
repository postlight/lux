// @flow
import { FINAL_HANDLER } from '../constants';
import getActionName from '../utils/get-action-name';
import getControllerName from '../utils/get-controller-name';
import type { Action } from '../interfaces';

/**
 * @private
 */
export default function trackPerf<T, U: Action<T>>(action: U): Action<T> {
  return async function trackedAction(req, res) {
    const start = Date.now();
    const result = await action(req, res);
    let { name } = action;
    let type = 'middleware';

    if (name === FINAL_HANDLER) {
      type = 'action';
      name = getActionName(req);
    } else if (!name) {
      name = 'anonymous';
    }

    res.stats.push({
      type,
      name,
      duration: Date.now() - start,
      controller: getControllerName(req)
    });

    return result;
  };
}
