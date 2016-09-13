// @flow

import { writeFile } from 'fs';
import { join } from 'path';

import range  from '../../../../utils/range';

export default function createTmpFiles(
  dir: string,
  numberToCreate: number
) {
  const filePaths = Array.from(range(1, numberToCreate))
    .map(() => join(dir, `${Date.now()}.tmp`));
  return Promise.all(filePaths.map((filePath) => {
    return new Promise((resolve, reject) => {
      writeFile(filePath, '', (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }));
}
