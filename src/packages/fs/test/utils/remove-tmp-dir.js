// @flow
import { join } from 'path';
import { tmpdir } from 'os';
import { rmdir, readdir, unlink } from 'fs';

export default function removeTmpDir(path: string) {
  return new Promise((resolve, reject) => {
    const dir = join(tmpdir(), path);

    readdir(dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      removeTmpFiles(files.map(fileName => join(path, fileName)))
        .then(() => {
          rmdir(dir, (error) => {
            if (err) {
              reject(err);
              return;
            }

            resolve();
          });
        })
        .catch(reject);
    });
  });
}

function removeTmpFiles(filePaths: Array<string>) {
  return Promise.all(filePaths.map(filePath => (
    new Promise((resolve, reject) => {
      unlink(filePath, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    })
  )));
}
