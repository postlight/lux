// @flow
import type { Request } from '../../../../request';

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
