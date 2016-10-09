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
      }

      if (Array.isArray(value)) {
        return {
          ...result,
          [key]: Promise.all(
            value.reduce((arr, { id, type }) => {
              const controller = controllers.get(type);

              if (controller) {
                return [
                  ...arr,
                  controller.model.find(id)
                ];
              }

              return arr;
            }, [])
          )
        };
      }

      if (isObject(value)) {
        const { id, type } = value;
        const controller = controllers.get(type);

        if (!controller) {
          return result;
        }

        return {
          ...result,
          [key]: controller.model.find(id)
        };
      }

      return result;
    }, {})
  );
}
