// @flow
import { ANSI } from '../constants';

import stringify from '../../../../utils/stringify';

import type { Logger$format } from '../../interfaces';

export default function formatMessage(data?: ?mixed, format: Logger$format) {
  if (data instanceof Error) {
    return data.stack;
  } else if (format === 'json') {
    return stringify(data).replace(ANSI, '');
  } else {
    return stringify(data, 2);
  }
}
