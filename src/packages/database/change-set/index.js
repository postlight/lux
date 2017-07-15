/* @flow */

import type { Model } from '../index'
import mapToObject from '@lux/utils/map-to-object'

class ChangeSet extends Map<string, any> {
  isPersisted: boolean

  constructor(data?: Object = {}): this {
    super(Object.entries(data))

    this.isPersisted = false
    return this
  }

  set(key: string, value: mixed): this {
    if (!this.isPersisted) {
      super.set(key, value)
    }

    return this
  }

  persist(group?: Array<ChangeSet>): this {
    if (group) {
      group.forEach(changeSet => changeSet.unpersist())
    }

    this.isPersisted = true
    return this
  }

  unpersist(): this {
    this.isPersisted = false
    return this
  }

  applyTo(target: Model): ChangeSet {
    const instance = new ChangeSet(mapToObject(this))

    target.changeSets.unshift(instance)
    return instance
  }
}

export default ChangeSet
