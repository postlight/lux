// @flow
import { mkdir } from 'fs';
import { sep, join, dirname } from 'path';

export default function createTmpDir() {
  return new Promise(resolve => {
    const path = join(sep, 'tmp');

    mkdir(dirname(path), undefined, () => resolve(path));
  });
}
