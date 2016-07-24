// @flow
import member from './enhancers/member';
import collection from './enhancers/collection';
import trackPerf from './enhancers/track-perf';

import type Controller from '../../controller';
import type { Action } from './interfaces';

/**
 * @private
 */
export function createAction(
  name: string,
  controller: Controller,
  action: Action<any>
): Array<Action<any>> {
  switch (name) {
    case 'index':
      action = collection(action);
      break;

    case 'create':
    case 'update':
    case 'show':
      action = member(action);
      break;
  }

  function __FINAL__HANDLER__(req, res): Promise<any> {
    return action(req, res);
  }

  return [...controller.middleware, __FINAL__HANDLER__].map(trackPerf);
}

export type { Action } from './interfaces';
