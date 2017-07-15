/* @flow */

const pick = <T: Object>(source: T, ...keys: Array<string>): T => {
  // $FlowFixMe
  const dest: T = {}

  return keys
    .map(key => [key, source[key]])
    .filter(([, value]) => value !== undefined)
    .reduce((prev, [key, value]) => {
      const next = prev

      next[key] = value
      return next
    }, dest)
}

export default pick
