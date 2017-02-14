// @flow
import entries from '../../../utils/entries';
import isObject from '../../../utils/is-object';
import type { ObjectMap } from '../../../interfaces';

const INT = /^\d+$/;
const CSV = /^(?:[\w\d-]+)(?:,[\w\d-]+)*$/;
const NULL = /^null$/;
const BOOL = /^(?:true|false)$/;
const DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{4})$/;
const TRUE = /^true$/;
const DELIMITER = /[_-\s]+/;

const camelize = (source: string) => (
  source
    .split(DELIMITER)
    .reduce((result, part, idx) => {
      if (part[0]) {
        const [first] = part;

        return (
          result
          + (idx === 0 ? first.toLowerCase() : first.toUpperCase())
          + part.slice(1).toLowerCase()
        );
      }

      return result;
    }, '')
);

const fromString = (source: string): any => {
  if (INT.test(source)) {
    return Number.parseInt(source, 10);
  } else if (BOOL.test(source)) {
    return TRUE.test(source);
  } else if (NULL.test(source)) {
    return null;
  } else if (CSV.test(source)) {
    return source.split(',');
  } else if (DATE.test(source)) {
    return new Date(source);
  }
  return source;
};

export const fromObject = (source: ObjectMap<any>): ObjectMap<any> => (
  entries(source).reduce((target, [k, v]) => {
    const key = camelize(k);
    let value = v;

    if (typeof value === 'string') {
      value = fromString(value);
    } else if (isObject(value)) {
      value = fromObject(value);
    }

    if (key === 'include') {
      if (Array.isArray(value)) {
        value = value.map(camelize);
      } else if (typeof value === 'string') {
        value = [camelize(value)];
      }
    } else if (key === 'fields' && isObject(value)) {
      value = entries(value).reduce((fields, [resource, names]) => {
        // eslint-disable-next-line no-param-reassign
        fields[resource] = (
          Array.isArray(names) ? names.map(camelize) : [camelize(names)]
        );
        return fields;
      }, {});
    }

    // eslint-disable-next-line no-param-reassign
    target[key] = value;

    return target;
  }, {})
);
