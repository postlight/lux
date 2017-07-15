/* @flow */

import type { Model } from '../../index'
import type { Relationship } from '../index'

import unassociate from './unassociate'
import validateType from './validate-type'
import { setHasOneInverse, setHasManyInverse } from './inverse-setters'

export const setHasMany = (
  owner: Model,
  key: string,
  value: Array<Model>,
  relationship: Relationship,
): void => {
  const { type, model, inverse, foreignKey } = relationship
  let { currentChangeSet: changeSet } = owner

  if (validateType(model, value)) {
    let prevValue = changeSet.get(key)

    if (Array.isArray(prevValue)) {
      prevValue = unassociate(prevValue, foreignKey)

      if (Array.isArray(prevValue)) {
        prevValue
          .filter(
            prev =>
              !value.find(
                next => prev.getPrimaryKey() === next.getPrimaryKey(),
              ),
          )
          .forEach(record => owner.prevAssociations.add(record))
      }
    }

    if (changeSet.isPersisted) {
      changeSet = changeSet.applyTo(owner)
    }

    changeSet.set(key, value)

    setHasManyInverse(owner, value, {
      type,
      model,
      inverse,
      foreignKey,
      inverseModel: model,
    })
  }
}

export const setHasOne = (
  owner: Model,
  key: string,
  value?: ?Model,
  relationship: Relationship,
): void => {
  const { type, model, inverse, foreignKey } = relationship
  let valueToSet = value

  if (value && typeof value === 'object' && !model.isInstance(value)) {
    valueToSet = Reflect.construct(model, [valueToSet])
  }

  let { currentChangeSet: changeSet } = owner

  if (valueToSet) {
    if (validateType(model, valueToSet)) {
      if (changeSet.isPersisted) {
        changeSet = changeSet.applyTo(owner)
      }

      changeSet.set(key, valueToSet)
    }
  } else {
    if (changeSet.isPersisted) {
      changeSet = changeSet.applyTo(owner)
    }

    changeSet.set(key, null)
  }

  setHasOneInverse(owner, valueToSet, {
    type,
    model,
    inverse,
    foreignKey,
    inverseModel: model,
  })
}

export const setBelongsTo = (
  owner: Model,
  key: string,
  value?: ?Model,
  relationship: Relationship,
): void => {
  const { type, model, inverse, foreignKey } = relationship
  setHasOne(owner, key, value, {
    type,
    model,
    inverse,
    foreignKey,
  })

  if (value) {
    Reflect.set(owner, foreignKey, Reflect.get(value, model.primaryKey))
  } else {
    Reflect.set(owner, foreignKey, null)
  }
}
