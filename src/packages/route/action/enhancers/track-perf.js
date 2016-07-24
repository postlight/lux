// @flow
import { FINAL_HANDLER } from '../constants';

import getActionName from '../utils/get-action-name';
import getControllerName from '../utils/get-controller-name';

import type { Action } from '../interfaces';

export default function trackPerf<T, U: Action<T>>(action: U): Action<T> {
  return async function trackedAction(req, res): Promise<T> {
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

    res.stats[res.stats.length] = {
      type,
      name,
      duration: Date.now() - start,
      controller: getControllerName(req)
    };

    return result;
  };
}
