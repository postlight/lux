/* @flow */

import { isNil } from '@lux/utils/is-type'

const compact = <T>(source: Array<T>): Array<T> =>
  source.filter(value => !isNil(value))

export default compact
