// @flow
import { classify, camelize, pluralize } from 'inflection';

import chain from '../../../utils/chain';
import entries from '../../../utils/entries';
import underscore from '../../../utils/underscore';
import template from '../../template';
import indent from '../utils/indent';

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

  const body = entries(
    attrs
      .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
      .map(attr => attr.split(':'))
      .reduce((obj, parts) => {
        const [, type] = parts;
        let [attr] = parts;
        let {
          hasOne,
          hasMany,
          attributes
        } = obj;

        attr = `${indent(8)}'${camelize(underscore(attr), true)}'`;

        switch (type) {
          case 'belongs-to':
          case 'has-one':
            hasOne = [...hasOne, attr];
            break;

          case 'has-many':
            hasMany = [...hasMany, attr];
            break;

          default:
            attributes = [...attributes, attr];
        }

        return {
          attributes,
          hasOne,
          hasMany
        };
      }, {
        attributes: [],
        belongsTo: [],
        hasOne: [],
        hasMany: []
      })
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
    import { Serializer } from 'lux-framework';

    class ${name}Serializer extends Serializer {
    ${body}
    }

    export default ${name}Serializer;
  `;
};
