// @flow
import path from 'path';

import { CWD } from '../../../constants';

import chain from '../../../utils/chain';

import type { fs$ParsedPath } from '../index';

/**
 * @private
 */
export default function resolvePath(
  cwd?: string = CWD,
  dir?: string = '',
  name?: string = ''
): fs$ParsedPath {
  return chain(name.split('/'))
    .pipe(parts => path.join(cwd, dir, ...parts))
    .pipe(path.parse)
    .pipe(({ base, ...etc }) => ({
      base,
      ...etc,
      relative: path.join(etc.dir.substr(etc.dir.indexOf(dir)), base),
      absolute: path.join(etc.dir, base)
    }))
    .value();
}
