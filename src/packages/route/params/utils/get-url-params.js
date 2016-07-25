// @flow
import Parameter from '../parameter';

import type { Params$opts } from '../interfaces';
import type { ParameterGroup$contents } from '../parameter-group/interfaces';

/**
 * @private
 */
export default function getURLParams(
  dynamicSegments: Params$opts.dynamicSegments
): Array<[string, ParameterGroup$contents]> {
  return dynamicSegments.map(param => [param, new Parameter({
    path: param,
    required: true
  })]);
}
