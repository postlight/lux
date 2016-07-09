// @flow
import { camelize } from 'inflection';

import pick from '../../../utils/pick';
import entries from '../../../utils/entries';

import type { IncomingMessage } from 'http';

/**
 * @private
 */
export default function sanitizeParams(req: IncomingMessage): void {
  const {
    modelName,

    model: {
      relationshipNames
    }
  }: {
    modelName: string,

    model: {
      relationshipNames: Array<string>
    }
  } = this;

  const params = { ...req.params };
  const { page } = params;

  let sortDirection;

  let {
    sort,
    filter,
    include,
    fields
  } = params;

  if (!sort) {
    sort = ['createdAt', 'ASC'];
  } else {
    if (!Array.isArray(sort)) {
      if (sort.charAt(0) === '-') {
        sort = sort.substr(1).replace(/\-/g, '_');
        sortDirection = 'DESC';
      } else {
        sort = sort.replace(/\-/g, '_');
        sortDirection = 'ASC';
      }

      sort = camelize(sort, true);

      if (this.sort.indexOf(sort) < 0) {
        sort = 'createdAt';
        sortDirection = 'ASC';
      }

      sort = [sort, sortDirection];
    }
  }

  if (!filter) {
    filter = {};
  }

  if (!include || typeof include !== 'string') {
    if (!Array.isArray(include)) {
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
    page,
    sort,
    include,
    fields,
    id: params.id,
    filter: pick(filter, ...this.filter)
  };

  if (/^(POST|PATCH)$/g.test(req.method)) {
    const {
      data: {
        type,
        attributes = {}
      }
    } = params;

    req.params = {
      ...req.params,

      data: {
        id: params.data.id,

        type,
        attributes: pick(attributes, ...this.params)
      }
    };
  }
}
