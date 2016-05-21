import { dasherize, underscore } from 'inflection';

const { ceil } = Math;
const { keys } = Object;

export default function createPageLinks(domain, path, params, total) {
  let i, key, str, val, first, last, prev, next, filterKeys, fieldKeys;
  let { page, limit, sort, filter, include, fields } = params;
  let base = domain + path;
  let lastPageNum = total === 0 ? 1 : ceil(total / limit);

  first = `${base}?page=1`;
  last = `${base}?page=${lastPageNum}`;

  if (page > 1) {
    prev = `${base}?page=${page - 1}`;
  } else {
    prev = null;
  }

  if (page !== lastPageNum && lastPageNum !== 1) {
    next = `${base}?page=${page + 1}`;
  } else {
    next = null;
  }

  if (limit !== 25) {
    first += `&limit=${limit}`;
    last += `&limit=${limit}`;

    if (next) {
      next += `&limit=${limit}`;
    }

    if (prev) {
      prev += `&limit=${limit}`;
    }
  }

  if (sort !== 'createdAt') {
    sort = dasherize(underscore(sort));

    first += `&sort=${sort}`;
    last += `&sort=${sort}`;

    if (next) {
      next += `&sort=${sort}`;
    }

    if (prev) {
      prev += `&sort=${sort}`;
    }
  }

  filterKeys = keys(filter);

  for (i = 0; i < filterKeys.length; i++) {
    key = filterKeys[i];
    val = filter[key];
    str = `&${encodeURIComponent(`filter[${key}]`)}=${encodeURIComponent(val)}`;

    first += str;
    last += str;

    if (next) {
      next += str;
    }

    if (prev) {
      prev += str;
    }
  }

  if (include.length) {
    str = `&include=${include.join(encodeURIComponent(','))}`;

    first += str;
    last += str;

    if (next) {
      next += str;
    }

    if (prev) {
      prev += str;
    }
  }

  fieldKeys = keys(fields);

  for (i = 0; i < fieldKeys.length; i++) {
    key = fieldKeys[i];
    val = fields[key];
    str = `&${encodeURIComponent(`fields[${key}]`)}=${encodeURIComponent(val)}`;

    first += str;
    last += str;

    if (next) {
      next += str;
    }

    if (prev) {
      prev += str;
    }
  }

  return {
    first,
    last,
    prev,
    next
  };
}
