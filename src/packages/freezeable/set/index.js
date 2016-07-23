// @flow
import freeze from '../utils/freeze';
import isFrozen from '../utils/is-frozen';

class FreezeableSet<T> extends Set<T> {
  add(value: T): this {
    if (!isFrozen(this)) {
      super.add(value);
    }

    return this;
  }

  clear(): void {
    if (!isFrozen(this)) {
      super.clear();
    }
  }

  delete(value: T): boolean {
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
