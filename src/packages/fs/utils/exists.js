import Promise from 'bluebird';
import { stat, readdir } from 'fs';

export default function exists(path, dir) {
  return new Promise((resolve, reject) => {
    const pathArgError = new TypeError(
      'First argument must be a string or RegExp.'
    );

    const dirArgError = new TypeError(
      'Second argument must be a string.'
    );

    switch (typeof path) {
      case 'string':
        stat(path, err => {
          if (err) {
            if (err.code === 'ENOENT') {
              resolve(false);
            } else {
              reject(err);
            }
          } else {
            resolve(true);
          }
        });
        break;

      case 'object':
        if (path instanceof RegExp) {
          if (typeof dir === 'string') {
            readdir(dir, (err, files) => {
              if (err) {
                reject(err);
              } else {
                resolve(files.some(file => path.test(file)));
              }
            });
          } else {
            reject(dirArgError);
          }
        } else {
          reject(pathArgError);
        }
        break;

      default:
        reject(pathArgError);
    }
  });
}
