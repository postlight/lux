/* @flow */

type Noop = (...arguments: Array<*>) => void

const noop: Noop = () => undefined
export default noop
