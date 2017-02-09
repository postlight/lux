// @flow
import { camelize, dasherize } from 'inflection';

import entries from './entries';
import underscore from './underscore';

/**
 * @private
 */
export function transformKeys<T: Object | Array<mixed>>(
  source: T,
  transformer: (key: string) => string,
  deep: boolean = false
): T {
  if (Array.isArray(source)) {
    return source.slice(0);
  } else if (source && typeof source === 'object') {
    // $FlowIgnore
    return entries(source).reduce((obj, [key, value]) => {
      const result = obj;
      const recurse = (
        deep
        && value
        && typeof value === 'object'
        && !Array.isArray(value)
        && !(value instanceof Date)
      );

      if (recurse) {
        result[transformer(key)] = transformKeys(value, transformer, true);
      } else {
        result[transformer(key)] = value;
      }

      return result;
    }, {});
  }

  // $FlowIgnore
  return {};
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
