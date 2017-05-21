/* @flow */

type Target = (...args: Array<any>) => Promise<any>

/**
 * Convert a function that implements a callback based interface into a function
 * that implements a Promise based interface.
 */
function promisify(source: Function, context?: ?Object): Target {
  return (...args: Array<any>) => (
    new Promise((resolve, reject) => {
      source.apply(context, [...args, (err, ...result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result.length > 1 ? result : result[0])
      }])
    })
  )
}

export default promisify
