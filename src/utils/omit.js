/* @flow */

const omit = <T: Object>(src: T, ...omitted: Array<string>): Object =>
  Object.entries(src).filter(([key]) => omitted.indexOf(key) < 0).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: value,
    }),
    {},
  )

export default omit
