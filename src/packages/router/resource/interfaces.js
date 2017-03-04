/* @flow */

import type Controller, { Controller$builtIn } from '../../controller';
import type { Namespace$opts } from '../namespace';

export type Resource$opts = Namespace$opts & {
  only: Array<Controller$builtIn>;
};
