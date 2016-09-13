// @flow

import { rmdir, readdir, unlink } from 'fs';
import { join } from 'path';

export default function removeTmpDir(path: string) {
  return new Promise((resolve, reject) => {
    readdir(path, (err, files) => {
      if (err) return reject(err);
      const filePaths = files.map(fileName => join(path, fileName));
      removeTmpFiles(filePaths)
        .then(() => {
          rmdir(path, (error) => {
            if (error) reject(error);
            resolve();
          });
        })
        .catch((error) => reject(error));
    });
  });
}

function removeTmpFiles(filePaths: Array<string>) {
  return Promise.all(filePaths.map((filePath) => {
    return new Promise((resolve, reject) => {
      unlink(filePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }));
}
