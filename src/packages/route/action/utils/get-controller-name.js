// @flow
import type { Request } from '../../../server';

export default function getControllerName({
  route: {
    controller: {
      constructor: {
        name
      }
    }
  }
}: Request): string {
  return name;
}
