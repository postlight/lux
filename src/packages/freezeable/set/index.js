/* @flow */

import freeze from '../utils/freeze'
import isFrozen from '../utils/is-frozen'

/**
 * @private
 */
class FreezeableSet<T> extends Set<T> {
  add(value: T): FreezeableSet<T> {
    if (!this.isFrozen()) {
      super.add(value)
    }

    return this
  }

  clear(): void {
    if (!this.isFrozen()) {
      super.clear()
    }
  }

  delete(value: T): boolean {
    return this.isFrozen() ? false : super.delete(value)
  }

  freeze(deep?: boolean): FreezeableSet<T> {
    if (deep) {
      this.forEach(Object.freeze)
    }

    return freeze(this)
  }

  isFrozen(): boolean {
    return isFrozen(this)
  }
}

export default FreezeableSet
