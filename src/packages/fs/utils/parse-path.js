/* @flow */

import * as path from 'path';

import { CWD } from '../../../constants';

type ParsedPath = {
  absolute: string;
  ext: string;
  dir: string;
  base: string;
  name: string;
  relative: string;
  root: string;
};

/**
 * @private
 */
export default function parsePath(
  cwd?: string = CWD,
  dir?: string = '',
  name?: string = ''
): ParsedPath {
  const parsed = path.parse(path.join(cwd, dir, ...name.split(path.sep)));

  return {
    ...parsed,
    absolute: path.join(parsed.dir, parsed.base),
    relative: path.join(
      parsed.dir.substr(parsed.dir.indexOf(dir)),
      parsed.base
    ),
  };
}
