// @flow
import { ParameterRequiredError } from '../errors';

import type ParameterGroup from '../index.js';

/**
 * @private
 */
export default function hasRequiredParams(
  group: ParameterGroup,
  params: Object
): boolean {
  for (const [key, { path, required }] of group) {
    if (required && !params.hasOwnProperty(key)) {
      throw new ParameterRequiredError(path);
    }
  }

  return true;
}
