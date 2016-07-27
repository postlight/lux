// @flow
import freeze from '../utils/freeze';
import isFrozen from '../utils/is-frozen';

/**
 * @private
 */
class FreezeableSet<T> extends Set<T> {
  add(value: T): FreezeableSet<T> {
    if (!isFrozen(this)) {
      super.add(value);
    }

    return this;
  }

  clear() {
    if (!isFrozen(this)) {
      super.clear();
    }
  }

  delete(value: T) {
    return isFrozen(this) ? false : super.delete(value);
  }

  freeze() {
    return freeze(this);
  }
}

export default FreezeableSet;
