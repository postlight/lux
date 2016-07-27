// @flow
import Parameter from '../parameter';

import type { ParameterLike, Params$opts } from '../interfaces';

/**
 * @private
 */
export default function getURLParams(
  dynamicSegments: Params$opts.dynamicSegments
): Array<[string, ParameterLike]> {
  return dynamicSegments.map(param => [param, new Parameter({
    path: param,
    required: true
  })]);
}
