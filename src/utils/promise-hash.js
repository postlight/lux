// @flow
import entries from './entries';

/**
 * @private
 */
export default function promiseHash(promises: {}): Promise<Object> {
  return new Promise((resolveHash, rejectHash) => {
    if (Object.keys(promises).length) {
      Promise.all(
        entries(promises).map(([key, value]) => {
          return new Promise((resolve, reject) => {
            value.then((resolvedValue) => {
              resolve({ [key]: resolvedValue });
            }, reject);
          });
        })
      ).then((objects) => {
        resolveHash(
          objects.reduce((hash, object) => Object.assign(hash, object))
        );
      }, rejectHash);
    } else {
      resolveHash({});
    }
  });
}
