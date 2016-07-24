// @flow
import type { Request } from '../../../server';

export default function getActionName({
  route: {
    action
  }
}: Request): string {
  return action;
}
