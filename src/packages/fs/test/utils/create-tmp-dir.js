// @flow
import { mkdir } from 'fs';
import { sep, join, dirname } from 'path';

export default function createTmpDir(path: string) {
  return createRootTmpDir(path)
    .then(() => new Promise((resolve, reject) => {
      mkdir(path, undefined, (err) => {
        if (err) return reject(err);
        resolve();
      });
    }));
}


function createRootTmpDir() {
  return new Promise(resolve => {
    const path = join(sep, 'tmp');

    mkdir(dirname(path), undefined, () => resolve(path));
  });
}
