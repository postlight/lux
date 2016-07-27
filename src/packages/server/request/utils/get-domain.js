// @flow
import type { Request } from '../interfaces';

/**
 * @private
 */
export default function getDomain({
  headers,

  connection: {
    encrypted
  }
}: Request): string {
  return `http${encrypted ? 's' : ''}://${headers.get('host') || 'localhost'}`;
}
