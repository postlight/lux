// @flow
import type { Request } from '../packages/request';

/**
 * @private
 */
export default function getDomain({ headers, encrypted }: Request): string {
  return `http${encrypted ? 's' : ''}://${headers.get('host') || 'localhost'}`;
}
