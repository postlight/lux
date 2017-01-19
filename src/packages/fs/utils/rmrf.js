// @flow
import path from 'path';

import { stat, rmdir, readdir, unlink } from '../index';

/**
 * @private
 */
function rmrf(target: string): Promise<boolean> {
  return stat(target)
    .then(stats => {
      if (stats && stats.isDirectory()) {
        return readdir(target);
      } else if (stats && stats.isFile()) {
        return unlink(target).then(() => []);
      }

      return [];
    })
    .then(files => (
      Promise.all(files.map(file => rmrf(path.join(target, file))))
    ))
    .then(() => rmdir(target))
    .catch(err => {
      if (err.code !== 'ENOENT') {
        return Promise.reject(err);
      }
    })
    .then(() => true);
}

export default rmrf;
