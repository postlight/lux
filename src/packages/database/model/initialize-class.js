// @flow
import { camelize, dasherize, pluralize, singularize } from 'inflection';

import { line } from '../../logger';

import {
  get as getRelationship,
  set as setRelationship
} from '../relationship';

import entries from '../../../utils/entries';
import underscore from '../../../utils/underscore';

import type Database, { Model } from '../index'; // eslint-disable-line no-unused-vars, max-len

const REFS = new WeakMap();

const VALID_HOOKS = [
  'afterCreate',
  'afterDestroy',
  'afterSave',
  'afterUpdate',
  'afterValidation',
  'beforeCreate',
  'beforeDestroy',
  'beforeSave',
  'beforeUpdate',
  'beforeValidation'
];

/**
 * @private
 */
function refsFor(instance) {
  let table = REFS.get(instance);

  if (!table) {
    table = Object.create(null);
    REFS.set(instance, table);
  }

  return table;
}

/**
 * @private
 */
function initializeProps(prototype, attributes, relationships) {
  Object.defineProperties(prototype, {
    ...entries(attributes)
      .reduce((hash, [key, { type, nullable, defaultValue }]) => {
        if (/^(boolean|tinyint)$/.test(type)) {
          defaultValue = Boolean(
            typeof defaultValue === 'string' ?
              parseInt(defaultValue, 10) : defaultValue
          );
        } else if (type === 'datetime' && typeof defaultValue === 'number') {
          defaultValue = new Date(defaultValue);
        }

        hash[key] = {
          get() {
            const refs = refsFor(this);

            return Reflect.get(refs, key) || defaultValue;
          },

          set(nextValue) {
            const refs = refsFor(this);
            const currentValue = Reflect.get(refs, key) || defaultValue;

            if (nextValue !== currentValue) {
              const { initialized, initialValues } = this;

              if (/^(boolean|tinyint)$/.test(type)) {
                nextValue = Boolean(
                  typeof nextValue === 'string' ?
                    parseInt(nextValue, 10) : nextValue
                );
              } else if (type === 'datetime' && typeof nextValue === 'number') {
                nextValue = new Date(nextValue);
              } else if (!nextValue && !nullable) {
                return;
              }

              Reflect.set(refs, key, nextValue);

              if (initialized) {
                const { dirtyAttributes } = this;
                const initialValue = initialValues.get(key) || defaultValue;

                if (nextValue !== initialValue) {
                  dirtyAttributes.add(key);
                } else {
                  dirtyAttributes.delete(key);
                }
              } else {
                initialValues.set(key, nextValue);
              }
            }
          }
        };

        return hash;
      }, {}),

    ...Object.keys(relationships).reduce((hash, key) => ({
      ...hash,

      [key]: {
        get() {
          return getRelationship(this, key);
        },

        set(val) {
          setRelationship(this, key, val);
        }
      }
    }), {})
  });
}

/**
 * @private
 */
function initializeHooks({
  model,
  hooks,
  logger
}) {
  hooks = entries({ ...hooks })
    .filter(([key]) => {
      const isValid = VALID_HOOKS.indexOf(key) >= 0;

      if (!isValid) {
        logger.warn(line`
          Invalid hook '${key}' will not be added to Model '${model.name}'.
          Valid hooks are ${VALID_HOOKS.map(h => `'${h}'`).join(', ')}.
        `);
      }

      return isValid;
    })
    .reduce((hash, [key, hook]) => ({
      ...hash,
      [key]: async (...args) => await Reflect.apply(hook, model, args)
    }), {});

  return Object.freeze(hooks);
}

/**
 * @private
 */
function initializeValidations({
  model,
  logger,
  validates,
  attributes
}) {
  const attributeNames = Object.keys(attributes);

  validates = entries(validates)
    .filter(([key, value]) => {
      let isValid = attributeNames.indexOf(key) >= 0;

      if (!isValid) {
        logger.warn(line`
          Invalid valiation '${key}' will not be added to Model '${model.name}'.
          '${key}' is not an attribute of Model '${model.name}'.
        `);
      }

      if (typeof value !== 'function') {
        isValid = false;

        logger.warn(line`
          Invalid valiation '${key}' will not be added to Model '${model.name}'.
          Validations must be a function.
        `);
      }

      return isValid;
    })
    .reduce((hash, [key, value]) => {
      return {
        ...hash,
        [key]: value
      };
    }, {});

  return Object.freeze(validates);
}

/**
 * @private
 */
export default async function initializeClass<T: Class<Model>>({
  store,
  table,
  model
}: {
  store: Database,
  table: Function,
  model: T
}): Promise<T> {
  const { hooks, scopes, validates } = model;
  const { logger } = store;
  const modelName = dasherize(underscore(model.name));
  const resourceName = pluralize(modelName);

  const attributes = entries(await table().columnInfo())
    .reduce((hash, [columnName, value]) => {
      return {
        ...hash,

        [camelize(columnName, true)]: {
          ...value,
          columnName,

          docName: dasherize(columnName)
        }
      };
    }, {});

  const belongsTo = entries(model.belongsTo || {})
    .reduce((hash, [relatedName, { inverse, model: relatedModel }]) => {
      const relationship = {};

      Object.defineProperties(relationship, {
        model: {
          value: store.modelFor(relatedModel || relatedName),
          writable: false,
          enumerable: true,
          configurable: false
        },

        inverse: {
          value: inverse,
          writable: false,
          enumerable: true,
          configurable: false
        },

        type: {
          value: 'belongsTo',
          writable: false,
          enumerable: false,
          configurable: false
        },

        foreignKey: {
          value: `${underscore(relatedName)}_id`,
          writable: false,
          enumerable: false,
          configurable: false
        }
      });

      return {
        ...hash,
        [relatedName]: relationship
      };
    }, {});

  const hasOne = entries(model.hasOne || {})
    .reduce((hash, [relatedName, { inverse, model: relatedModel }]) => {
      const relationship = {};

      Object.defineProperties(relationship, {
        model: {
          value: store.modelFor(relatedModel || relatedName),
          writable: false,
          enumerable: true,
          configurable: false
        },

        inverse: {
          value: inverse,
          writable: false,
          enumerable: true,
          configurable: false
        },

        type: {
          value: 'hasOne',
          writable: false,
          enumerable: false,
          configurable: false
        },

        foreignKey: {
          value: `${underscore(inverse)}_id`,
          writable: false,
          enumerable: false,
          configurable: false
        }
      });

      return {
        ...hash,
        [relatedName]: relationship
      };
    }, {});

  const hasMany = entries(model.hasMany || {})
    .reduce((hash, [relatedName, {
      inverse,
      through, model: relatedModel
    }]) => {
      const relationship = {};
      let foreignKey;

      if (typeof relatedModel === 'string') {
        relatedModel = store.modelFor(relatedModel);
      } else {
        relatedModel = store.modelFor(relatedName);
      }

      if (typeof through === 'string') {
        through = store.modelFor(through);
        foreignKey = `${singularize(underscore(inverse))}_id`;
      } else {
        foreignKey = `${underscore(inverse)}_id`;
      }

      Object.defineProperties(relationship, {
        model: {
          value: relatedModel,
          writable: false,
          enumerable: true,
          configurable: false
        },

        inverse: {
          value: inverse,
          writable: false,
          enumerable: true,
          configurable: false
        },

        through: {
          value: through,
          writable: false,
          enumerable: Boolean(through),
          configurable: false
        },

        type: {
          value: 'hasMany',
          writable: false,
          enumerable: false,
          configurable: false
        },

        foreignKey: {
          value: foreignKey,
          writable: false,
          enumerable: false,
          configurable: false
        }
      });

      return {
        ...hash,
        [relatedName]: relationship
      };
    }, {});

  Object.freeze(hasOne);
  Object.freeze(hasMany);
  Object.freeze(belongsTo);

  const relationships = Object.freeze({
    ...hasOne,
    ...hasMany,
    ...belongsTo
  });

  Object.defineProperties(model, {
    store: {
      value: store,
      writable: false,
      enumerable: false,
      configurable: false
    },

    table: {
      value: table,
      writable: false,
      enumerable: false,
      configurable: false
    },

    logger: {
      value: logger,
      writable: false,
      enumerable: false,
      configurable: false
    },

    attributes: {
      value: Object.freeze(attributes),
      writable: false,
      enumerable: false,
      configurable: false
    },

    attributeNames: {
      value: Object.freeze(Object.keys(attributes)),
      writable: false,
      enumerable: false,
      configurable: false
    },

    hasOne: {
      value: hasOne,
      writable: false,
      enumerable: Boolean(Object.keys(hasOne).length),
      configurable: false
    },

    hasMany: {
      value: hasMany,
      writable: false,
      enumerable: Boolean(Object.keys(hasMany).length),
      configurable: false
    },

    belongsTo: {
      value: belongsTo,
      writable: false,
      enumerable: Boolean(Object.keys(belongsTo).length),
      configurable: false
    },

    relationships: {
      value: relationships,
      writable: false,
      enumerable: false,
      configurable: false
    },

    relationshipNames: {
      value: Object.freeze(Object.keys(relationships)),
      writable: false,
      enumerable: false,
      configurable: false
    },

    hooks: {
      value: initializeHooks({
        model,
        hooks,
        logger
      }),
      writable: false,
      enumerable: Boolean(Object.keys(hooks).length),
      configurable: false
    },

    scopes: {
      value: scopes,
      writable: false,
      enumerable: Boolean(Object.keys(scopes).length),
      configurable: false
    },

    validates: {
      value: initializeValidations({
        model,
        logger,
        validates,
        attributes
      }),
      writable: false,
      enumerable: Boolean(Object.keys(validates).length),
      configurable: false
    },

    modelName: {
      value: modelName,
      writable: false,
      enumerable: true,
      configurable: false
    },

    resourceName: {
      value: resourceName,
      writable: false,
      enumerable: true,
      configurable: false
    },

    initialized: {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    },

    ...Object.freeze(entries(scopes).reduce((hash, [name, scope]) => {
      return {
        ...hash,

        [name]: {
          value: scope,
          writable: false,
          enumerable: false,
          configurable: false
        }
      };
    }, {}))
  });

  initializeProps(model.prototype, attributes, {
    ...hasOne,
    ...hasMany,
    ...belongsTo
  });

  Object.defineProperties(model.prototype, {
    modelName: {
      value: modelName,
      writable: false,
      enumerable: true,
      configurable: false
    },

    resourceName: {
      value: resourceName,
      writable: false,
      enumerable: true,
      configurable: false
    }
  });

  return model;
}
