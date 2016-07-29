// @flow
import entries from '../../../utils/entries';
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
      if (Array.isArray(value)) {
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
      } else {
        const { id, type } = value;
        const controller = controllers.get(type);

        if (controller) {
          return {
            ...result,
            [key]: controller.model.find(id)
          };
        } else {
          return result;
        }
      }
    }, {})
  );
}
