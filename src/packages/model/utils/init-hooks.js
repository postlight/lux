import { line } from '../../logger';

const { create, defineProperty, entries } = Object;

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

const defaultHooks = {
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

export default function initHooks(model, hooks) {
  defineProperty(model, 'hooks', {
    value: entries({ ...defaultHooks, ...hooks })
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
