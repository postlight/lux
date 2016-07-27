// @flow
import freeze from '../utils/freeze';
import isFrozen from '../utils/is-frozen';

/**
 * @private
 */
class FreezeableMap<K, V> extends Map<K, V> {
  set(key: K, value: V): FreezeableMap<K, V> {
    if (!isFrozen(this)) {
      super.set(key, value);
    }

    return this;
  }

  clear() {
    if (!isFrozen(this)) {
      super.clear();
    }
  }

  delete(key: K) {
    return isFrozen(this) ? false : super.delete(key);
  }

  freeze() {
    return freeze(this);
  }
}

export default FreezeableMap;
