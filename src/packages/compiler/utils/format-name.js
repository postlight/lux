// @flow
import { posix, dirname, basename } from 'path';

import { camelize } from 'inflection';

import underscore from '../../../utils/underscore';
import { compose } from '../../../utils/compose';

const DOUBLE_COLON = /::/g;

/**
 * @private
 */
const formatName: (source: string) => string = compose(
  (name: string) => name.replace(DOUBLE_COLON, '$'),
  camelize,
  underscore,
  (name: string) => posix.join(
    dirname(name),
    basename(name, '.js')
  )
);

export default formatName;
