// @flow
import freeze from '../utils/freeze';
import isFrozen from '../utils/is-frozen';

class FreezeableSet<V: any> extends Set {
  add(value: V): this {
    if (!isFrozen(this)) {
      super.add(value);
    }

    return this;
  }

  delete(value: V): boolean {
    if (!isFrozen(this)) {
      return super.delete(value);
    }

    return false;
  }

  freeze(): this {
    return freeze(this);
  }
}

export default FreezeableSet;
