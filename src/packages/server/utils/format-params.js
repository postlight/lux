import moment from 'moment';

import bodyParser from './body-parser';

const { assign } = Object;
const { isArray } = Array;

const int = /^\d+$/ig;
const isoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{4})$/ig;

function format(params) {
  const result = {};
  let key, value;

  for (key in params) {
    if (params.hasOwnProperty(key)) {
      value = params[key];
      key = key.replace(/(\[\])/g, '');

      if (value && typeof value === 'object') {
        if (isArray(value)) {
          value = value.map(i => int.test(i) ? parseInt(i, 10) : i);
        } else {
          value = format(value);
        }
      } else {
        if (int.test(value)) {
          value = parseInt(value, 10);
        } else if (isoDate.test(value)) {
          value = moment(value).toDate();
        }
      }

      result[key] = value;
    }
  }

  return result;
}

export default async function formatParams(req) {
  let params;

  if (/(PATCH|POST|PUT)/g.test(req.method)) {
    params = assign({}, {
      data: {
        attributes: {}
      }
    }, await bodyParser(req));
  } else {
    params = req.url.query;
  }

  return format(params);
}
