// @flow
import freeze from '../utils/freeze';
import isFrozen from '../utils/is-frozen';

/**
 * @private
 */
class FreezeableMap<K, V> extends Map<K, V> {
  set(key: K, value: V): FreezeableMap<K, V> {
    if (!this.isFrozen()) {
      super.set(key, value);
    }

    return this;
  }

  clear() {
    if (!this.isFrozen()) {
      super.clear();
    }
  }

  delete(key: K) {
    return this.isFrozen() ? false : super.delete(key);
  }

  freeze() {
    return freeze(this);
  }

  isFrozen() {
    return isFrozen(this);
  }
}

export default FreezeableMap;
