import moment from 'moment';
import { camelize } from 'inflection';

import bodyParser from './body-parser';
import camelizeKeys from '../../../utils/camelize-keys';

const { keys, assign } = Object;
const { isArray } = Array;

const int = /^\d+$/g;
const bool = /^(true|false)$/i;
const isoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{4})$/ig;

function format(params, method = 'GET') {
  const result = {};
  let i, key, value, paramKeys;

  paramKeys = keys(params);

  for (i = 0; i < paramKeys.length; i++) {
    key = paramKeys[i];
    value = params[key];

    key = key.replace(/(\[\])/g, '');

    if (value) {
      switch (typeof value) {
        case 'object':
          if (isArray(value)) {
            value = value.map(v => {
              return int.test(v) ? parseInt(v, 10) : v;
            });
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

    result[key] = value;
  }

  return camelizeKeys(result, true);
}

export default async function formatParams(req) {
  const { method, url: { query } } = req;
  const pattern = /^(.+)\[(.+)\]$/g;
  let i, key, parent, nested, params, paramKeys;

  params = assign({ data: { attributes: {} } }, query);
  paramKeys = keys(params);

  for (i = 0; i < paramKeys.length; i++) {
    key = paramKeys[i];

    if (pattern.test(key)) {
      parent = key.replace(pattern, '$1');
      nested = key.replace(pattern, '$2');

      if (!params[parent]) {
        params[parent] = {};
      }

      params[parent][nested] = params[key];

      delete params[key];
    }
  }

  if (/(PATCH|POST)/g.test(method)) {
    assign(params, await bodyParser(req));
  }

  return format(params, method);
}
