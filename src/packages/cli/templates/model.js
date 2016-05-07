import { classify, camelize } from 'inflection';

import indent from '../utils/indent';
import underscore from '../../../utils/underscore';

const { entries } = Object;

export default (name, attrs = []) => {
  name = classify(underscore(name));

  const body = entries(
    attrs
      .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
      .map(attr => attr.split(':'))
      .filter(([, type]) => /^belongs-to|has-(one|many)$/g.test(type))
      .reduce(({ belongsTo, hasOne, hasMany }, [related, type]) => {
        const inverse = camelize(name, true);

        related = camelize(underscore(related), true);

        switch (type) {
          case 'belongs-to':
            belongsTo = [
              ...belongsTo,

              indent(4) + `${related}: {\n` +
              indent(6) + `inverse: '${inverse}'\n` +
              indent(4) + '}'
            ];
            break;

          case 'has-one':
            hasOne = [
              ...hasOne,

              indent(4) + `${related}: {\n` +
              indent(6) + `inverse: '${inverse}'\n` +
              indent(4) + '}'
            ];
            break;

          case 'has-many':
            hasMany = [
              ...hasMany,

              indent(4) + `${related}: {\n` +
              indent(6) + `inverse: '${inverse}'\n` +
              indent(4) + '}'
            ];
            break;
        }

        return {
          belongsTo,
          hasOne,
          hasMany
        };
      }, { belongsTo: [], hasOne: [], hasMany: [] })
  ).reduce((str, [key, value], index) => {
    if (value.length) {
      value = value.join(',\n\n');

      if (index && str.length) {
        str += '\n\n';
      }

      str += `${indent(2)}static ${key} = {\n${value}\n${indent(2)}};`;
    }

    return str;
  }, '');

  return `
import { Model } from 'lux-framework';

class ${name} extends Model {
${body}
}

export default ${name};

  `.substr(1).trim();
};
