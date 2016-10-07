// @flow
import path from 'path';

import { stat, rmdir, readdir, unlink } from '../index';
import tryCatch from '../../../utils/try-catch';

/**
 * @private
 */
async function rmrf(target: string): Promise<boolean> {
  const stats = await tryCatch(() => stat(target));

  if (stats && stats.isDirectory()) {
    let files = await tryCatch(() => readdir(target));

    if (files) {
      files = files.map(file => rmrf(path.join(target, file)));

      await Promise.all(files);
      await rmdir(target);
    }
  } else if (stats && stats.isFile()) {
    await tryCatch(() => unlink(target));
  }

  return true;
}

export default rmrf;
