// @flow
import { ResourceMismatchError } from '../errors';
import type { Request } from '../../../../request';

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
    throw new ResourceMismatchError('data.id', String(id), String(resourceId));
  }

  return true;
}
