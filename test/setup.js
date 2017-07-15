/* @flow */

import entries from 'object.entries'
import values from 'object.values'

if (Object.entries === undefined) {
  entries.shim()
}

if (Object.values === undefined) {
  values.shim()
}
