// @flow
import { mkdir } from 'fs';

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
