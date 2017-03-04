/* @flow */

import template from '../../template';

/**
 * @private
 */
export default (name: string): string => template`
  # ${name}

  ## Installation

  *   \`git clone https://github.com/<this-repository>\`
  *   \`cd ${name}\`
  *   \`npm install\`

  ## Running / Development

  *   \`lux serve\`

  ## Testing

  *   \`lux test\`

  ## Further Reading / Useful Links
  *   [Lux](https://github.com/postlight/lux/)
  *   [Chai](http://chaijs.com/) / [Mocha](http://mochajs.org/)
`;
