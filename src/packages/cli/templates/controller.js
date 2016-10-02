// @flow
import { classify, camelize, pluralize } from 'inflection';

import template from '../../template';
import entries from '../../../utils/entries';
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
    normalized = pluralize(normalized);
  }

  const body = entries(
    attrs
      .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
      .map(attr => attr.split(':')[0])
      .reduce((obj, attr) => ({
        ...obj,
        params: [
          ...obj.params,
          `${indent(8)}'${camelize(underscore(attr), true)}'`
        ]
      }), { params: [] })
  ).reduce((result, group, index) => {
    const [key] = group;
    let [, value] = group;
    let str = result;

    if (value.length) {
      value = value.join(',\n');

      if (index && str.length) {
        str += '\n\n';
      }

      str += `${indent(index === 0 ? 2 : 6)}${key} = ` +
        `[\n${value}\n${indent(6)}];`;
    }

    return str;
  }, '');

  return template`
    import { Controller } from 'lux-framework';

    class ${normalized}Controller extends Controller {
    ${body}
    }

    export default ${normalized}Controller;
  `;
};
