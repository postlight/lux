// @flow
import { BACKSLASH, PLATFORM } from '../../../constants';

import type { fs$PathRemover } from '../interfaces';

/**
 * @private
 */
export default function createPathRemover(path: string): fs$PathRemover {
  let pattern = new RegExp(`${path}(/)?(.+)`);

  if (PLATFORM.startsWith('win')) {
    const sep = '\\\\';

    path = path.replace(BACKSLASH, sep);
    pattern = new RegExp(`${path}(${sep})?(.+)`);
  }

  return source => source.replace(pattern, '$2');
}
