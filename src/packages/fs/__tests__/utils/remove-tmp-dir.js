// @flow
import { join } from 'path';
import { rmdir, readdir, unlink } from 'fs';

function removeTmpFiles(paths: Array<string>): Promise<Array<string>> {
  return Promise.all(paths.map(path => (
    new Promise((resolve, reject) => {
      unlink(path, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve(path);
      });
    })
  )));
}

export default function removeTmpDir(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    readdir(path, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(files);
    });
  }).then(files => (
    removeTmpFiles(files.map(name => join(path, name)))
  )).then(() => (
    new Promise((resolve, reject) => {
      rmdir(path, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    })
  ));
}
