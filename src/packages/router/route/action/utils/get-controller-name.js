// @flow
import type { Request } from '../../../../server';

/**
 * @private
 */
export default function getControllerName({
  route: {
    controller: {
      constructor: {
        name
      }
    }
  }
}: Request): string {
  return name;
}
