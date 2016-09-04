// @flow
import { classify, camelize, pluralize } from 'inflection';

import template from '../../template';

import indent from '../utils/indent';
import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default (name: string, attrs: Array<string>): string => {
  name = classify(underscore(name));

  if (!attrs) {
    attrs = [];
  }

  if (!name.endsWith('Application')) {
    name = pluralize(name);
  }

  const body = attrs
    .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
    .map(attr => attr.split(':'))
    .filter(([, type]) => !/^belongs-to|has-(one|many)$/g.test(type))
    .reduce((str, [attr, type], index, array) => {
      if (index === 0) {
        str += (indent(2) + `params = [\n`);
      }

      str += (indent(8) + `'${camelize(underscore(attr), true)}'`);

      if (index === array.length - 1) {
        str += `\n${indent(6)}];`;
      } else {
        str += ',\n';
      }

      return str;
    }, '');

  return template`
    import { Controller } from 'lux-framework';

    class ${name}Controller extends Controller {
    ${body}
    }

    export default ${name}Controller;
  `;
};
