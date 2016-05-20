import { camelize } from 'inflection';

import pick from '../../../utils/pick';

const { isArray } = Array;
const { entries, assign } = Object;

export default function sanitizeParams(req, res) {
  const { modelName, model: { relationshipNames } } = this;
  const params = { ...req.params };
  let { page, limit, sort, filter, include, fields } = params;

  if (!page) {
    page = 1;
  } else if (typeof page === 'string') {
    page = parseInt(page, 10);
  }

  if (!limit) {
    limit = 25;
  } else if (typeof limit === 'string') {
    limit = parseInt(limit, 10);
  }

  if (!sort) {
    sort = 'createdAt';
  } else {
    if (sort.charAt(0) === '-') {
      sort = `-${sort.substr(1).replace(/\-/g, '_')}`;
    } else {
      sort = sort.replace(/\-/g, '_');
    }

    sort = camelize(sort, true);

    if (this.sort.indexOf(sort) < 0 &&
      this.sort.indexOf(sort.substr(1)) < 0) {
        sort = 'createdAt';
    }
  }

  if (!filter) {
    filter = {};
  }

  if (!include || typeof include !== 'string') {
    if (!isArray(include)) {
      include = [];
    }
  } else {
    if (include.indexOf(',') >= 0) {
      include = include.split(',');
    } else {
      include = [include];
    }
  }

  include = include
    .filter(included => relationshipNames.indexOf(included) >= 0);

  fields = entries(fields || {})
    .reduce((obj, [key, value]) => {
      if (typeof value === 'string') {
        value = [value];
      }

      if (key === modelName) {
        const { attributes } = this;

        if (value.length) {
          value = attributes.filter(attr => {
            return attr.indexOf('id') >= 0 || value.indexOf(attr) >= 0;
          });
        } else {
          value = attributes;
        }
      }

      return {
        ...obj,
        [key]: value
      };
    }, {});

  req.params = {
    id: params.id,
    filter: pick(filter, ...this.filter),

    page,
    limit,
    sort,
    include,
    fields
  };

  if (/^(POST|PATCH)$/g.test(req.method)) {
    let { type, attributes } = params.data;

    assign(req.params, {
      data: {
        id: params.data.id,

        type,
        attributes: pick(attributes, ...this.params)
      }
    });
  }
}
