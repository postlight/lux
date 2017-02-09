// @flow
import getControllerName from '../utils/get-controller-name';
import type { Action } from '../interfaces';

/**
 * @private
 */
export default function trackPerf<T, U: Action<T>>(action: U): Action<T> {
  // eslint-disable-next-line func-names
  const trackedAction = function (req, res, data) {
    const start = Date.now();

    return action(req, res, data).then(result => {
      let { name } = action;
      const type = 'middleware';

      if (!name) {
        name = 'anonymous';
      }

      res.stats.push({
        type,
        name,
        duration: Date.now() - start,
        controller: getControllerName(req)
      });

      return result;
    });
  };

  Object.defineProperty(trackedAction, 'name', {
    value: action.name
  });

  return trackedAction;
}
