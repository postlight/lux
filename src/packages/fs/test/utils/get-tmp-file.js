// @flow
import { readdir } from 'fs';
import { join } from 'path';

export default function getTmpFile(path: string) {
  return new Promise((resolve, reject) => {
    readdir(path, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(join(path, files[0]));
    });
  });
}
