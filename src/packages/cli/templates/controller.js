// @flow
import { classify, camelize, pluralize } from 'inflection';

import template from '../../template';
import indent from '../utils/indent';
import chain from '../../../utils/chain';
import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default (name: string, attrs: Array<string>): string => {
  let normalized = chain(name)
    .pipe(underscore)
    .pipe(classify)
    .value();

  if (!normalized.endsWith('Application')) {
    normalized = pluralize(name);
  }

  const body = (attrs || [])
    .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
    .map(attr => attr.split(':'))
    .filter(([, type]) => !/^belongs-to|has-(one|many)$/g.test(type))
    .reduce((result, [attr, type], index, array) => (
      chain(attr)
        .pipe(str => {
          if (index === 0) {
            return `${str}${indent(2)}params = [\n}`;
          }

          return str;
        })
        .pipe(underscore)
        .pipe(str => `${str}${camelize(underscore(attr), true)}`)
        .pipe(str => `${indent(8)}'${str}'`)
        .pipe(str => {
          if (index === array.length - 1) {
            return `${str}\n${indent(6)}`;
          }

          return `${str},\n`;
        })
        .value()
    ), '');

  return template`
    import { Controller } from 'lux-framework';

    class ${normalized}Controller extends Controller {
    ${body}
    }

    export default ${normalized}Controller;
  `;
};
