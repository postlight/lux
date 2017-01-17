// @flow
import { camelize, dasherize } from 'inflection';

import entries from './entries';
import setType from './set-type';
import underscore from './underscore';

/**
 * @private
 */
export function transformKeys<T: Object | Array<mixed>>(
  source: T,
  transformer: (key: string) => string,
  deep: boolean = false
): T {
  return setType(() => {
    if (Array.isArray(source)) {
      return source.slice(0);
    } else if (source && typeof source === 'object') {
      return entries(source).reduce((result, [key, value]) => {
        const recurse = deep
          && value
          && typeof value === 'object'
          && !Array.isArray(value)
          && !(value instanceof Date);

        if (recurse) {
          return {
            ...result,
            [transformer(key)]: transformKeys(value, transformer, true)
          };
        }

        return {
          ...result,
          [transformer(key)]: value
        };
      }, {});
    }

    return {};
  });
}

/**
 * @private
 */
export function camelizeKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => camelize(underscore(key), true), deep);
}

/**
 * @private
 */
export function dasherizeKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => dasherize(underscore(key), true), deep);
}

/**
 * @private
 */
export function underscoreKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => underscore(key), deep);
}
