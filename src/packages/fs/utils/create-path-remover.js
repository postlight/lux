// @flow
import { PLATFORM } from '../../../constants';

/**
 * @private
 */
function createPathRemover(path: string): (src: string) => string {
  let pattern = new RegExp(`${path}(/)?(.+)`);

  if (PLATFORM.startsWith('win')) {
    const sep = '\\\\';

    pattern = new RegExp(`${path.replace(/\\/g, sep)}(${sep})?(.+)`);
  }

  return source => source.replace(pattern, '$2');
}

export default createPathRemover;
