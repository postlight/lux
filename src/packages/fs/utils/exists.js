// @flow
import { stat, readdir } from '../index';

import tryCatch from '../../../utils/try-catch';

/**
 * @private
 */
export default async function exists(
  path: string | RegExp,
  dir: string
): Promise<boolean> {
  if (typeof path === 'string') {
    return Boolean(await tryCatch(() => stat(path)));
  } else if (path instanceof RegExp) {
    const pattern = path;
    let files = [];

    if (dir) {
      files = await readdir(dir);
    }

    return files.some(file => pattern.test(file));
  }

  return false;
}
