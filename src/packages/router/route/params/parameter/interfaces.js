/* @flow */

import type { ParameterLike$opts } from '../index';

export type Parameter$opts = ParameterLike$opts & {
  values?: Array<any>;
};
