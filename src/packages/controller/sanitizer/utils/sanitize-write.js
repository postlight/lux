// @flow
import pick from '../../../../utils/pick';
import present from '../../../../utils/present';

import type { Request } from '../../../server';

/**
 * @private
 */
export default function sanitizeWrite({
  route: {
    controller
  },

  params: {
    id,

    data: {
      type,
      attributes
    } = {}
  }
}: Request): Object {
  if (!present(id, type, attributes)) {
    throw new TypeError('Missing required parameter');
  }

  return {
    id,

    data: {
      id,
      type,
      attributes: pick(attributes || {}, ...controller.attributes)
    }
  };
}
