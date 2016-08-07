// @flow
import path from 'path';

import { stat, rmdir, readdir, unlink } from '../index';

import tryCatch from '../../../utils/try-catch';

/**
 * @private
 */
async function rmrf(target: string) {
  const stats = await tryCatch(() => stat(target));

  if (stats && stats.isDirectory()) {
    await rmdirRec(target);
  } else if (stats && stats.isFile()) {
    await tryCatch(() => unlink(target));
  }

  return true;
}

/**
 * @private
 */
async function rmdirRec(target: string) {
  let files = await tryCatch(() => readdir(target));

  if (files) {
    files = files.map(file => {
      return rmrf(path.join(target, file));
    });

    await Promise.all(files);
    await rmdir(target);
  }
}

export default rmrf;
