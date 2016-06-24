// @flow
import path from 'path';

import fs from '../index';
import tryCatch from '../../../utils/try-catch';

/**
 * @private
 */
async function rmrf(target: string): Promise<boolean> {
  const stats = await tryCatch(() => fs.statAsync(target));

  if (stats && stats.isDirectory()) {
    await rmdir(target);
  } else if (stats && stats.isFile()) {
    await tryCatch(() => fs.unlinkAsync(target));
  }

  return true;
}

/**
 * @private
 */
async function rmdir(target: string): Promise<void> {
  let files = await tryCatch(() => fs.readdirAsync(target));

  if (files) {
    files = files.map(file => {
      return rmrf(path.join(target, file));
    });

    await Promise.all(files);
    await fs.rmdirAsync(target);
  }
}

export default rmrf;
