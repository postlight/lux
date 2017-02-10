// @flow
import type { Request } from '../../../../request';

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
