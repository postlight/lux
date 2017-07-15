/* @flow */

import { pluralize, singularize } from 'inflection'

import { line } from '@lux/packages/logger'
import { camelize, dasherize, underscore } from '@lux/packages/inflector'
import { isFunction, isObject, isString } from '@lux/utils/is-type'
import { createAttribute } from '../attribute'
import { get as getRelationship, set as setRelationship } from '../relationship'
import type Database, { Model } from '../index'

const VALID_HOOKS = new Set([
  'afterCreate',
  'afterDestroy',
  'afterSave',
  'afterUpdate',
  'afterValidation',
  'beforeCreate',
  'beforeDestroy',
  'beforeSave',
  'beforeUpdate',
  'beforeValidation',
])

/**
 * @private
 */
function initializeProps(prototype, attributes, relationships) {
  Object.defineProperties(prototype, {
    ...Object.entries(attributes).reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key]: createAttribute({
          key,
          ...value,
        }),
      }),
      {},
    ),
    ...Object.keys(relationships).reduce(
      (obj, key) => ({
        ...obj,
        [key]: {
          get() {
            return getRelationship(this, key)
          },
          set(val) {
            setRelationship(this, key, val)
          },
        },
      }),
      {},
    ),
  })
}

/**
 * @private
 */
const initHooks = ({ model, hooks, logger }) =>
  Object.freeze(
    Object.entries(hooks).reduce((prev, [key, value]) => {
      const next = prev

      if (!VALID_HOOKS.has(key)) {
        logger.warn(line`
          Invalid hook '${key}' will not be added to Model '${model.name}'.
          Valid hooks are ${[...VALID_HOOKS].map(h => `'${h}'`).join(', ')}.
        `)

        return next
      }

      if (isFunction(value)) {
        next[key] = (...args) =>
          Promise.resolve(Reflect.apply(value, model, args))
      } else {
        logger.warn(line`
          Invalid hook '${key}' will not be added to Model '${model.name}'.
          '${key}' must be a function.
        `)
      }

      return next
    }, {}),
  )

/**
 * @private
 */
function initializeValidations(opts) {
  const { model, logger, attributes } = opts
  const attributeNames = Object.keys(attributes)
  let { validates } = opts

  validates = Object.entries(validates)
    .filter(([key, value]) => {
      let isValid = attributeNames.indexOf(key) >= 0

      if (!isValid) {
        logger.warn(line`
          Invalid validation '${key}' will not be added to Model
          '${model.name}'. '${key}' is not an attribute of Model
          '${model.name}'.
        `)
      }

      if (typeof value !== 'function') {
        isValid = false

        logger.warn(line`
          Invalid validation '${key}' will not be added to Model
          '${model.name}'. Validations must be a function.
        `)
      }

      return isValid
    })
    .reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key]: value,
      }),
      {},
    )

  return Object.freeze(validates)
}

/**
 * @private
 */
export default (async function initializeClass<T: Class<Model>>({
  store,
  table,
  model,
}: {
  store: Database,
  table: $PropertyType<T, 'table'>,
  model: T,
}): Promise<T> {
  let { hooks, scopes, validates } = model
  const { logger } = store
  const modelName = dasherize(model.name)
  const resourceName = pluralize(modelName)

  const attributes = Object.entries(
    await table().columnInfo(),
  ).reduce((prev, [columnName, value]) => {
    const next = prev

    if (isObject(value)) {
      next[camelize(columnName)] = {
        ...value,
        columnName,
        docName: dasherize(columnName),
      }
    }

    return next
  }, {})

  const belongsTo = Object.entries(
    model.belongsTo || {},
  ).reduce((prev, [key, value]) => {
    const next = prev
    const relationship = {}

    if (isObject(value)) {
      Object.defineProperties(relationship, {
        model: {
          value: store.modelFor(isString(value.model) ? value.model : key),
          enumerable: true,
        },
        inverse: {
          value: value.inverse,
          enumerable: true,
        },
        type: {
          value: 'belongsTo',
          enumerable: false,
        },
        foreignKey: {
          value: `${underscore(key)}_id`,
        },
      })

      next[key] = relationship
    }

    return next
  }, {})

  const hasOne = Object.entries(
    model.hasOne || {},
  ).reduce((prev, [key, value]) => {
    const next = prev
    const relationship = {}

    if (isObject(value) && isString(value.inverse)) {
      const inverse = value.inverse

      Object.defineProperties(relationship, {
        model: {
          value: store.modelFor(isString(value.model) ? value.model : key),
          enumerable: true,
        },
        inverse: {
          value: inverse,
          enumerable: true,
        },
        type: {
          value: 'hasOne',
        },
        foreignKey: {
          value: `${underscore(inverse)}_id`,
        },
      })

      next[key] = relationship
    }

    return next
  }, {})

  const hasMany = Object.entries(
    model.hasMany || {},
  ).reduce((prev, [key, value]) => {
    const next = prev
    const relationship = {}

    if (isObject(value) && isString(value.inverse)) {
      const { inverse } = value
      let { through } = value
      let foreignKey

      if (isString(through)) {
        through = store.modelFor(through)
        foreignKey = `${singularize(underscore(inverse))}_id`
      } else {
        foreignKey = `${underscore(inverse)}_id`
      }

      Object.defineProperties(relationship, {
        model: {
          value: store.modelFor(isString(value.model) ? value.model : key),
          enumerable: true,
        },
        inverse: {
          value: inverse,
          enumerable: true,
        },
        through: {
          value: through,
          enumerable: Boolean(through),
        },
        type: {
          value: 'hasMany',
        },
        foreignKey: {
          value: foreignKey,
        },
      })

      next[key] = relationship
    }

    return next
  }, {})

  Object.freeze(hasOne)
  Object.freeze(hasMany)
  Object.freeze(belongsTo)

  const relationships = Object.freeze({
    ...hasOne,
    ...hasMany,
    ...belongsTo,
  })

  if (!hooks) {
    hooks = {}
  }

  if (!scopes) {
    scopes = {}
  }

  if (!validates) {
    validates = {}
  }

  Object.defineProperties(model, {
    store: {
      value: store,
    },
    table: {
      value: table,
    },
    logger: {
      value: logger,
    },
    attributes: {
      value: Object.freeze(attributes),
    },
    attributeNames: {
      value: Object.freeze(Object.keys(attributes)),
    },
    hasOne: {
      value: hasOne,
      enumerable: Boolean(Object.keys(hasOne).length),
    },
    hasMany: {
      value: hasMany,
      enumerable: Boolean(Object.keys(hasMany).length),
    },
    belongsTo: {
      value: belongsTo,
      enumerable: Boolean(Object.keys(belongsTo).length),
    },
    relationships: {
      value: relationships,
    },
    relationshipNames: {
      value: Object.freeze(Object.keys(relationships)),
    },
    hooks: {
      value: initHooks({
        model,
        hooks,
        logger,
      }),
      enumerable: Boolean(Object.keys(hooks).length),
    },
    scopes: {
      value: scopes,
      enumerable: Boolean(Object.keys(scopes).length),
    },
    validates: {
      value: initializeValidations({
        model,
        logger,
        validates,
        attributes,
      }),
      enumerable: Boolean(Object.keys(validates).length),
    },
    modelName: {
      value: modelName,
      enumerable: true,
    },
    resourceName: {
      value: resourceName,
      enumerable: true,
    },
    initialized: {
      value: true,
    },
    ...Object.freeze(
      Object.entries(scopes).reduce((prev, [key, value]) => {
        const next = prev

        next[key] = { value }
        return next
      }, {}),
    ),
  })

  initializeProps(model.prototype, attributes, {
    ...hasOne,
    ...hasMany,
    ...belongsTo,
  })

  Object.defineProperties(model.prototype, {
    modelName: {
      value: modelName,
      enumerable: true,
    },
    resourceName: {
      value: resourceName,
      enumerable: true,
    },
    isModelInstance: {
      value: true,
    },
  })

  return model
})
