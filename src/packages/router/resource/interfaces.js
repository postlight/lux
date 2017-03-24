/* @flow */

import type Controller, { BuiltInAction } from '../../controller';
import type { Namespace$opts } from '../namespace';

export type Resource$opts = Namespace$opts & {
  only: Array<BuiltInAction>;
};
