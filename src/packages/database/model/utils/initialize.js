import { camelize, dasherize, singularize } from 'inflection';

import { line } from '../../../logger';
import underscore from '../../../../utils/underscore';

const { isArray } = Array;
const { create, defineProperties, entries, keys } = Object;

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

const DEFAULT_HOOKS = {
  async afterCreate() {
    return true;
  },

  async afterDestroy() {
    return true;
  },

  async afterSave() {
    return true;
  },

  async afterUpdate() {
    return true;
  },

  async afterValidation() {
    return true;
  },

  async beforeCreate() {
    return true;
  },

  async beforeDestroy() {
    return true;
  },

  async beforeSave() {
    return true;
  },

  async beforeUpdate() {
    return true;
  },

  async beforeValidation() {
    return true;
  }
};

function refsFor(instance) {
  let table = REFS.get(instance);

  if (!table) {
    table = create(null);
    REFS.set(instance, table);
  }

  return table;
}

function initializeProps(prototype, attributes, relationships) {
  const props = create(null);

  entries(attributes)
    .reduce((hash, [key, { type, nullable, defaultValue }]) => {
      hash[key] = {
        get() {
          const refs = refsFor(this);

          return refs[key] || defaultValue;
        },

        set(nextValue) {
          const refs = refsFor(this);
          const currentValue = refs[key] || defaultValue;

          if (nextValue !== currentValue) {
            const { initialized, initialValues } = this;

            if (/^(boolean|tinyint)$/.test(type)) {
              nextValue = Boolean(nextValue);
            } else if (type === 'datetime' && typeof nextValue === 'number') {
              nextValue = new Date(nextValue);
            } else if (!nextValue && !nullable) {
              return;
            }

            refs[key] = nextValue;

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
    }, props);

  entries(relationships)
    .reduce((hash, [key, { type, model }]) => {
      if (type === 'hasMany') {
        hash[key] = {
          get() {
            const refs = refsFor(this);

            return refs[key] || [];
          },

          set(value) {
            const refs = refsFor(this);

            if (isArray(value)) {
              refs[key] = value.map(record => new model(record));
            }
          }
        };
      } else {
        hash[key] = {
          get() {
            return refsFor(this)[key] || null;
          },

          set(record) {
            refsFor(this)[key] = record ? new model(record) : undefined;
          }
        };
      }

      return hash;
    }, props);

  defineProperties(prototype, props);
}

function initializeHooks(model, hooks) {
  return entries({ ...DEFAULT_HOOKS, ...hooks })
    .filter(([key]) => {
      const isValid = VALID_HOOKS.indexOf(key) >= 0;

      if (!isValid) {
        model.logger.warn(line`
          Invalid hook '${key}' will not be added to Model '${model.name}'.
          Valid hooks are ${VALID_HOOKS.map(h => `'${h}'`).join(', ')}.
        `);
      }

      return isValid;
    })
    .reduce((hash, [key, hook]) => {
      return {
        ...hash,
        [key]: async (...args) => await hook.apply(model, args)
      };
    }, create(null));
}

function initializeValidations(model, attributes, validations) {
  const attributeNames = keys(attributes);

  return entries(validations)
    .filter(([key, value]) => {
      let isValid = attributeNames.indexOf(key) >= 0;

      if (!isValid) {
        model.logger.warn(line`
          Invalid valiation '${key}' will not be added to Model '${model.name}'.
          '${key}' is not an attribute of Model '${model.name}'.
        `);
      }

      if (typeof value !== 'function') {
        isValid = false;

        model.logger.warn(line`
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
    }, create(null));
}

export default async function initialize(store, model, table) {
  const { hooks, validates } = model;
  const { logger } = store;

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
    .reduce((hash, [relatedName, value]) => {
      return {
        ...hash,

        [relatedName]: {
          foreignKey: `${underscore(relatedName)}_id`,

          ...value,

          type: 'belongsTo',
          model: store.modelFor(value.model || relatedName)
        }
      };
    }, {});

  const hasOne = entries(model.hasOne || {})
    .reduce((hash, [relatedName, value]) => {
      return {
        foreignKey: `${underscore(value.inverse)}_id`,

        ...hash,

        [relatedName]: {

          ...value,

          type: 'hasOne',
          model: store.modelFor(value.model || relatedName)
        }
      };
    }, {});

  const hasMany = entries(model.hasMany || {})
    .reduce((hash, [relatedName, value]) => {
      return {
        ...hash,

        [relatedName]: {
          foreignKey: `${underscore(value.inverse)}_id`,

          ...value,

          type: 'hasMany',
          model: store.modelFor(value.model || singularize(relatedName))
        }
      };
    }, {});

  defineProperties(model, {
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
      value: attributes,
      writable: false,
      enumerable: false,
      configurable: false
    },

    belongsTo: {
      value: belongsTo,
      writable: false,
      enumerable: false,
      configurable: false
    },

    hasOne: {
      value: hasOne,
      writable: false,
      enumerable: false,
      configurable: false
    },

    hasMany: {
      value: hasMany,
      writable: false,
      enumerable: false,
      configurable: false
    },

    hooks: {
      value: initializeHooks(model, hooks),
      writable: false,
      enumerable: false,
      configurable: false
    },

    validates: {
      value: initializeValidations(model, attributes, validates),
      writable: false,
      enumerable: false,
      configurable: false
    }
  });

  initializeProps(model.prototype, attributes, {
    ...belongsTo,
    ...hasOne,
    ...hasMany
  });

  return model;
}
