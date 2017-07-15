/* @flow */

/**
 * @private
 */
export default function promiseHash(promises: Object): Promise<Object> {
  if (Object.keys(promises).length) {
    return Promise.all(
      Object.entries(promises).map(
        ([key, promise]) =>
          new Promise((resolve, reject) => {
            if (promise && typeof promise.then === 'function') {
              promise.then(value => resolve({ [key]: value })).catch(reject)
            } else {
              resolve({ [key]: promise })
            }
          }),
      ),
    ).then(objects =>
      objects.reduce(
        (hash, object) => ({
          ...hash,
          ...object,
        }),
        {},
      ),
    )
  }

  return Promise.resolve({})
}
