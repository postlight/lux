// @flow
import type { Request } from '../../../../server';

/**
 * @private
 */
export default function getActionName({
  route: {
    action
  }
}: Request): string {
  return action;
}
