import { dasherize, underscore } from 'inflection';

import omit from '../../../utils/omit';
import {
  getClassMethods,
  getInstanceMethods
} from '../../../utils/get-methods';

export default function adapter(model) {
  const name = dasherize(underscore(model.name));
  const methods = getInstanceMethods(model);
  const classMethods = getClassMethods(model);

  const attributes = {
    ...model.attributes
  };

  const hasOne = {
    ...model.hasOne
  };

  const hasMany = {
    ...model.hasMany
  };

  const hooks = {
    ...model.hooks
  };

  for (let key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      attributes[key] = {
        mapsTo: underscore(key),
        ...attributes[key]
      };
    }
  }

  for (let key in hasOne) {
    if (hasOne.hasOwnProperty(key)) {
      let options = hasOne[key];
      let relModel = options.model;

      hasOne[key] = [
        key,
        relModel,

        {
          autoFetch: true,
          autoFetchLimit: 50,
          ...omit(options, 'model')
        }
      ];
    }
  }

  for (let key in hasMany) {
    if (hasMany.hasOwnProperty(key)) {
      let options = hasMany[key];
      let relModel = options.model;

      hasMany[key] = [
        key,
        relModel,

        {
          autoFetch: true,
          autoFetchLimit: 50,
          ...omit(options, 'model')
        }
      ];
    }
  }

  for (let key in hooks) {
    if (hooks.hasOwnProperty(key)) {
      let hook = hooks[key];

      if (typeof hook === 'function') {
        hooks[key] = async function (next) {
          try {
            await hook.call(this);
            return next();
          } catch (err) {
            console.error(err);
          }
        };
      }
    }
  }

  return [
    attributes,

    {
      hooks,
      methods: {
        ...methods,
        getModelName() {
          return name;
        }
      }
    },

    classMethods,
    hasOne,
    hasMany
  ];
}
