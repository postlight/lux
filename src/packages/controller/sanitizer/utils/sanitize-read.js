// @flow
import { camelize } from 'inflection';

import pick from '../../../../utils/pick';
import compact from '../../../../utils/compact';
import present from '../../../../utils/present';
import isObject from '../../../../utils/is-object';

import type Controller from '../../index';
import type { Request, Request$params } from '../../../server';

function sanitizePage(page: Request$params.page): void | Request$params.page {
  if (page && isObject(page)) {
    let { size, number } = page;

    if (present(size, number)) {
      size = parseInt(size, 10);
      number = parseInt(number, 10);

      if (Number.isFinite(size) && Number.isFinite(number)) {
        return {
          size,
          number
        };
      }
    }
  }
}

function sanitizeSort(
  sort: Request$params.sort,
  controller: Controller
): void | Request$params.sort {
  if (typeof sort === 'string') {
    let key;
    let direction;

    if (sort.charAt(0) === '-') {
      key = sort.substr(1).replace(/\-/g, '_');
      direction = 'DESC';
    } else {
      key = sort.replace(/\-/g, '_');
      direction = 'ASC';
    }

    key = camelize(key, true);

    if (controller.sort.indexOf(key) >= 0) {
      return [key, direction];
    }
  }
}

function sanitizeFilter(
  filter?: Object,
  controller: Controller
): void | Object {
  if (filter) {
    return pick(filter, ...controller.filter);
  }
}

function sanitizeFields(fields: Array<string> | Object, {
  modelName,
  attributes,

  model: {
    primaryKey
  }
}: Controller): void | Array<string> {
  if (fields && !Array.isArray(fields)) {
    fields = fields[modelName];

    if (fields) {
      if (typeof fields === 'string') {
        fields = [fields];
      }

      return fields.filter(field => {
        return field === primaryKey || attributes.indexOf(field) >= 0;
      });
    }
  }
}

function sanitizeInclude(
  include: Array<string> | Object,
  fields: Array<string> | Object,
  controller: Controller
): void | Object {
  if (include && Array.isArray(include) && fields && !Array.isArray(fields)) {
    const {
      model: {
        relationshipNames
      }
    } = controller;

    return include
      .filter(key => relationshipNames.indexOf(key) >= 0)
      .reduce((result, key) => {
        return {
          ...result,
          [key]: ['id']
        };
      }, {});
  }
}

/**
 * @private
 */
export default function sanitizeRead({
  route: {
    controller
  },

  params: {
    id,
    page,
    sort,
    filter,
    fields,
    include
  }
}: Request): Object {
  return compact({
    id,
    page: sanitizePage(page),
    sort: sanitizeSort(sort, controller),
    filter: sanitizeFilter(filter, controller),
    include: sanitizeInclude(include, fields, controller),
    fields: sanitizeFields(fields, controller)
  });
}
