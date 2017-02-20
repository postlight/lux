// @flow
import { join } from 'path';
import { writeFile } from 'fs';

import range from '../../../../utils/range';

export default function createTmpFiles(
  dir: string,
  numberToCreate: number
): Promise<Array<string>> {
  const filePaths = Array
    .from(range(1, numberToCreate))
    .map(() => join(dir, `${Date.now()}.tmp`));

  return Promise.all(filePaths.map(filePath => (
    new Promise((resolve, reject) => {
      writeFile(filePath, '', err => {
        if (err) {
          reject(err);
          return;
        }

        resolve(filePath);
      });
    })
  )));
}
