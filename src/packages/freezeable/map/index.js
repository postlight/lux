// @flow
import freeze from '../utils/freeze';
import isFrozen from '../utils/is-frozen';

class FreezeableMap<K: any, V: any> extends Map {
  set(key: K, value: V): this {
    if (!isFrozen(this)) {
      super.set(key, value);
    }

    return this;
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
