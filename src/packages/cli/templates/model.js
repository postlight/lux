// @flow
import { EOL } from 'os';
import { classify, camelize } from 'inflection';

import template from '../../template';

import indent from '../utils/indent';
import entries from '../../../utils/entries';
import underscore from '../../../utils/underscore';

const VALID_ATTR = /^(\w|-)+:(\w|-)+$/;
const RELATIONSHIP = /^belongs-to|has-(one|many)$/;

/**
 * @private
 */
export default (name: string, attrs: Array<string>) => {
  name = classify(underscore(name));

  if (!attrs) {
    attrs = [];
  }

  return template`
    import { Model } from 'lux-framework';

    class ${name} extends Model {
    ${entries(attrs
      .filter(attr => VALID_ATTR.test(attr))
      .map(attr => attr.split(':'))
      .filter(([, type]) => RELATIONSHIP.test(type))
      .reduce((types, [related, type]) => {
        type = camelize(underscore(type), true);

        const value = Reflect.get(types, type);


        if (value) {
          const inverse = camelize(name, true);

          related = camelize(underscore(related), true);

          return {
            ...types,

            [type]: [
              ...value,

              indent(8)
                + `${related}: {${EOL}`
                + indent(10)
                + `inverse: '${inverse}'${EOL}`
                + indent(8)
                + '}'
            ]
          };
        } else {
          return types;
        }
      }, {
        hasOne: [],
        hasMany: [],
        belongsTo: []
      }))
      .filter(([, value]) => value.length)
      .reduce((str, [key, value], index) => {
        value = value.join(',' + EOL.repeat(2));

        if (index && str.length) {
          str += EOL.repeat(2);
        }

        return str
          + `${indent(index === 0 ? 2 : 6)}static ${key} = `
          + `{${EOL}${value}${EOL}${indent(6)}};`;
      }, '')}
    }

    export default ${name};
  `;
};
