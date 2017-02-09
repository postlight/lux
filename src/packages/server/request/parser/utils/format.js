// @flow
import { camelize } from 'inflection';

import { INT, NULL, BOOL, DATE, TRUE, BRACKETS } from '../constants';
import isNull from '../../../../../utils/is-null';
import entries from '../../../../../utils/entries';
import underscore from '../../../../../utils/underscore';
import { camelizeKeys } from '../../../../../utils/transform-keys';
import type { Request$method } from '../../interfaces';

/**
 * @private
 */
function makeArray(source: string | Array<string>): Array<string> {
  if (!Array.isArray(source)) {
    return source.includes(',') ? source.split(',') : [source];
  }

  return source;
}

/**
 * @private
 */
function formatString(source: string, method: Request$method): mixed {
  if (method === 'GET') {
    if (source.indexOf(',') >= 0) {
      return source.split(',').map(str => camelize(underscore(str), true));
    } else if (INT.test(source)) {
      return Number.parseInt(source, 10);
    } else if (BOOL.test(source)) {
      return TRUE.test(source);
    } else if (NULL.test(source)) {
      return null;
    }
  }

  if (DATE.test(source)) {
    return new Date(source);
  }

  return source;
}

/**
 * @private
 */
function formatObject(
  source: Object | Array<any>,
  method: Request$method,
  formatter: (params: Object, method: Request$method) => Object
): Object | Array<any> {
  if (Array.isArray(source)) {
    return source.map(value => {
      if (INT.test(value)) {
        return Number.parseInt(value, 10);
      }

      return value;
    });
  }

  return formatter(source, method);
}

/**
 * @private
 */
export function formatSort(sort: string): string {
  if (sort.startsWith('-')) {
    return `-${camelize(underscore(sort.substr(1)), true)}`;
  }

  return camelize(underscore(sort), true);
}

/**
 * @private
 */
export function formatFields(fields: Object): Object {
  return entries(fields).reduce((obj, [key, value]) => {
    const result = obj;

    result[key] = makeArray(value);
    return result;
  }, {});
}

/**
 * @private
 */
export function formatInclude(include: string | Array<string>): Array<string> {
  return makeArray(include);
}

/**
 * @private
 */
export default function format(params: Object, method: Request$method): Object {
  const result = entries(params).reduce((obj, param) => {
    const data = obj;
    const [, value] = param;
    let [key] = param;
    let formatted;

    key = key.replace(BRACKETS, '');

    switch (typeof value) {
      case 'object':
        formatted = isNull(value) ? null : formatObject(value, method, format);
        break;

      case 'string':
        formatted = formatString(value, key === 'id' ? 'GET' : method);
        break;

      default:
        formatted = value;
        break;
    }

    data[key] = formatted;
    return data;
  }, {});

  return camelizeKeys(result, true);
}
