import moment from 'moment';
import { camelize } from 'inflection';

import bodyParser from './body-parser';
import camelizeKeys from '../../../utils/camelize-keys';

const { assign, entries } = Object;
const { isArray } = Array;

const int = /^\d+$/g;
const bool = /^(true|false)$/i;
const isoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{4})$/ig;

function format(params, method = 'GET') {
  params = entries(params).reduce((result, [key, value]) => {
    key = key.replace(/(\[\])/g, '');

    if (value) {
      switch (typeof value) {
        case 'object':
          if (isArray(value)) {
            value = value.map(v => int.test(v) ? parseInt(v, 10) : v);
          } else {
            value = format(value, method);
          }
          break;

        case 'string':
          if (method === 'GET' && value.indexOf(',') >= 0) {
            value = value.split(',').map(v => {
              return camelize(v.replace(/\-/g, '_'), true);
            });
          } else {
            if (int.test(value)) {
              value = parseInt(value, 10);
            } else if (bool.test(value)) {
              value = /^true$/i.test(value);
            } else if (isoDate.test(value)) {
              value = moment(value).toDate();
            }
          }
          break;
      }
    }

    return {
      ...result,
      [key]: value
    };
  }, {});

  return camelizeKeys(params, true);
}

export default async function formatParams(req) {
  const { method, url: { query } } = req;
  const pattern = /^(.+)\[(.+)\]$/g;
  let params = assign({ data: { attributes: {} } }, query);

  params = entries(params).reduce((result, [key, value]) => {
    if (pattern.test(key)) {
      let parentKey, parentValue, childKey;

      parentKey = key.replace(pattern, '$1');
      parentValue = result[parentKey];

      childKey = key.replace(pattern, '$2');

      if (!parentValue) {
        parentValue = {};
      }

      return {
        ...result,
        [parentKey]: {
          ...parentValue,
          [childKey]: value
        }
      };
    } else {
      return {
        ...result,
        [key]: value
      };
    }
  }, {});

  if (/(PATCH|POST)/g.test(method)) {
    assign(params, await bodyParser(req));
  }

  return format(params, method);
}
