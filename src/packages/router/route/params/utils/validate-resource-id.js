// @flow
import { ResourceMismatchError } from '../errors';

import type { Request } from '../../../../server';

/**
 * @private
 */
export default function validateResourceId({
  params: {
    id,

    data: {
      id: resourceId
    }
  }
}: Request): true {
  if (id !== resourceId) {
    id = id.toString();

    if (resourceId) {
      resourceId = resourceId.toString();
    }

    throw new ResourceMismatchError('data.id', id, resourceId);
  }

  return true;
}
