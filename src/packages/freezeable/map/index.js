// @flow
import freeze from '../utils/freeze';
import isFrozen from '../utils/is-frozen';

class FreezeableMap<K, V> extends Map<K, V> {
  set(key: K, value: V): this {
    if (!isFrozen(this)) {
      super.set(key, value);
    }

    return this;
  }

  clear(): void {
    if (!isFrozen(this)) {
      super.clear();
    }
  }

  delete(key: K): boolean {
    if (!isFrozen(this)) {
      return super.delete(key);
    }

    return false;
  }

  freeze(): this {
    return freeze(this);
  }
}

export default FreezeableMap;
