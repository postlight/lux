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

    pattern = new RegExp(`${path.replace(BACKSLASH, sep)}(${sep})?(.+)`);
  }

  return source => source.replace(pattern, '$2');
}
