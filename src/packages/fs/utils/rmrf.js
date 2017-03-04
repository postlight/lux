/* @flow */

import * as path from 'path';

import noop from '../../../utils/noop';
import { stat, rmdir, readdir, unlink } from '../index';

/**
 * @private
 */
async function rmrf(target: string): Promise<boolean> {
  const stats = await stat(target).catch(noop);

  if (stats) {
    if (stats.isDirectory()) {
      const files = await readdir(target);

      await Promise.all(
        files.map(file => rmrf(path.join(target, file)))
      );

      await rmdir(target).catch(noop);
    } else {
      await unlink(target);
    }
  }

  return true;
}

export default rmrf;
