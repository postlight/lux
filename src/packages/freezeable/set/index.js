// @flow
import freeze from '../utils/freeze';
import isFrozen from '../utils/is-frozen';

/**
 * @private
 */
class FreezeableSet<T> extends Set<T> {
  add(value: T): FreezeableSet<T> {
    if (!this.isFrozen()) {
      super.add(value);
    }

    return this;
  }

  clear() {
    if (!this.isFrozen()) {
      super.clear();
    }
  }

  delete(value: T) {
    return this.isFrozen() ? false : super.delete(value);
  }

  freeze() {
    return freeze(this);
  }

  isFrozen() {
    return isFrozen(this);
  }
}

export default FreezeableSet;
