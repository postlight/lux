/* @flow */

import template from '../../template';

/**
 * @private
 */
export default (): string => template`
  # See http://help.github.com/ignore-files/ for more about ignoring files.

  # dependencies
  /node_modules

  # build
  /dist

  # logs
  /log
  npm-debug.log

  # misc
  *.DS_Store
`;
