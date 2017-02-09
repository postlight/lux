// @flow
import entries from './entries';

/**
 * @private
 */
export default function promiseHash(promises: Object): Promise<Object> {
  const iter = entries(promises);

  if (iter.length) {
    return Promise.all(
      iter.map(([key, promise]: [string, Promise<mixed>]) => (
        new Promise((resolve, reject) => {
          if (promise && typeof promise.then === 'function') {
            promise
              .then((value) => resolve({ [key]: value }))
              .catch(reject);
          } else {
            resolve({ [key]: promise });
          }
        })
      ))
    ).then(objects => (
      Object.assign({}, ...objects)
    ));
  }

  return Promise.resolve({});
}
