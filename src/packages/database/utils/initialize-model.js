import { camelize, dasherize, singularize } from 'inflection';

import { line } from '../../logger';
import underscore from '../../../utils/underscore';

const { isArray } = Array;

const {
  assign,
  create,
  defineProperties,
  defineProperty,
  entries
} = Object;

const REFS = new WeakMap();

const VALID_HOOKS = [
  'afterCreate',
  'afterDestroy',
  'afterSave',
  'afterUpdate',
  'beforeCreate',
  'beforeDestroy',
  'beforeSave',
  'beforeUpdate'
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
};

function refsFor(instance) {
  let table = REFS.get(instance);

  if (!table) {
    table = create(null);
    REFS.set(instance, table);
  }

  return table;
}

function initializeHooks(model, hooks) {
  defineProperty(model, 'hooks', {
    value: entries({ ...DEFAULT_HOOKS, ...hooks })
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
      }, create(null))
  });
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

        set(value) {
          const refs = refsFor(this);

          if (type === 'tinyint') {
            value = Boolean(value);
          } else if (!value && !nullable) {
            return;
          }

          refs[key] = value;
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

export default async function initializeModel(store, model, table) {
  const { hooks } = model;
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

  assign(model, {
    store,
    table,
    logger,
    attributes,
    belongsTo,
    hasOne,
    hasMany
  });

  initializeHooks(model, hooks);

  initializeProps(model.prototype, attributes, {
    ...belongsTo,
    ...hasOne,
    ...hasMany
  });

  return model;
}
