// @flow
import type { Model } from '../index';
import entries from '../../../utils/entries';

class ChangeSet extends Map<string, mixed> {
  isPersisted: boolean;

  constructor(data?: Object = {}): this {
    super(entries(data));

    this.isPersisted = false;

    return this;
  }

  set(key: string, value: mixed): this {
    if (!this.isPersisted) {
      super.set(key, value);
    }

    return this;
  }

  persist(group?: Array<ChangeSet>): this {
    if (group) {
      group.forEach(changeSet => changeSet.unpersist());
    }

    this.isPersisted = true;

    return this;
  }

  unpersist(): this {
    this.isPersisted = false;
    return this;
  }

  applyTo(target: Model): ChangeSet {
    const data = Array
      .from(this)
      .reduce((obj, [key, value]) => ({
        ...obj,
        [key]: value
      }), {});

    const instance = new ChangeSet(data);

    target.changeSets.unshift(instance);

    return instance;
  }
}

export default ChangeSet;
