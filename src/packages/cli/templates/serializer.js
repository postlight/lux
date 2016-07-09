// @flow
import { classify, camelize, pluralize } from 'inflection';

import template from '../../template';

import indent from '../utils/indent';
import entries from '../../../utils/entries';
import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default (name: string, attrs: Array<string>): string => {
  name = classify(underscore(name));

  if (!attrs) {
    attrs = [];
  }

  if (name !== 'Application') {
    name = pluralize(name);
  }

  const body = entries(
    attrs
      .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
      .map(attr => attr.split(':'))
      .reduce(({ attributes, hasOne, hasMany }, [attr, type]) => {
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
  ).reduce((str, [key, value], index) => {
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
