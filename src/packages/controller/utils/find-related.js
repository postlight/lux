// @flow
import isNull from '../../../utils/is-null';
import entries from '../../../utils/entries';
import isObject from '../../../utils/is-object';
import promiseHash from '../../../utils/promise-hash';

import type { JSONAPI$IdentifierObject } from '../../jsonapi';
import type Controller from '../index';

/**
 * @private
 */
export default function findRelated(
  controllers: Map<string, Controller>,
  relationships: Object
) {
  return promiseHash(
    entries(relationships).reduce((result, [key, { data: value }]: [string, {
      data: JSONAPI$IdentifierObject | Array<JSONAPI$IdentifierObject>
    }]) => {
      if (isNull(value)) {
        return {
          ...result,
          [key]: value
        };
      } else if (Array.isArray(value)) {
        return {
          ...result,
          [key]: Promise.all(
            value.map(({ id, type }) => {
              const controller = controllers.get(type);

              if (controller) {
                return controller.model.find(id);
              }
            })
          )
        };
      } else if (isObject(value)) {
        const { id, type } = value;
        const controller = controllers.get(type);

        if (!controller) {
          return result;
        }

        return {
          ...result,
          [key]: controller.model.find(id)
        };
      } else {
        return result;
      }
    }, {})
  );
}
