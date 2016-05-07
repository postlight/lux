import { classify, camelize, pluralize } from 'inflection';

import indent from '../utils/indent';
import underscore from '../../../utils/underscore';

const { entries } = Object;

export default (name, attrs = []) => {
  name = classify(underscore(name));

  if (name !== 'Application') {
    name = pluralize(name);
  }

  const body = entries(
    attrs
      .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
      .map(attr => attr.split(':'))
      .reduce(({ attributes, hasOne, hasMany }, [attr, type]) => {
        attr = `${indent(4)}'${camelize(underscore(attr), true)}'`;

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
      }, { attributes: [], belongsTo: [], hasOne: [], hasMany: [] })
  ).reduce((str, [key, value], index) => {
    if (value.length) {
      value = value.join(',\n');

      if (index && str.length) {
        str += '\n\n';
      }

      str += `${indent(2)}${key} = [\n${value}\n${indent(2)}];`;
    }

    return str;
  }, '');

  return `
import { Serializer } from 'lux-framework';

class ${name}Serializer extends Serializer {
${body}
}

export default ${name}Serializer;
  `.substr(1).trim();
};
