// @flow
import { mkdir } from 'fs';
import { sep, join, dirname } from 'path';

export default function createTmpDir(path: string) {
  return new Promise((resolve, reject) => {
    mkdir(path, undefined, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}


function createRootTmpDir() {
  return new Promise(resolve => {
    const path = join(sep, 'tmp');

    mkdir(dirname(path), undefined, () => resolve(path));
  });
}
