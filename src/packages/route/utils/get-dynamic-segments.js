// @flow
import { DYNAMIC_PATTERN } from '../constants';

import insert from '../../../utils/insert';

/**
 * @private
 */
export default function getDynamicSegments(path: string): Array<string> {
  const matches = (path.match(DYNAMIC_PATTERN) || []).map(part => {
    return part.substr(1);
  });

  const dynamicSegments = new Array(matches.length);

  insert(dynamicSegments, matches);

  Object.freeze(dynamicSegments);

  return dynamicSegments;
}
