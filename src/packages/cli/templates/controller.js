import { classify, camelize, pluralize } from 'inflection';

import indent from '../utils/indent';
import underscore from '../../../utils/underscore';

export default (name, attrs = []) => {
  name = classify(underscore(name));

  if (name !== 'Application') {
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

      str += (indent(4) + `'${camelize(underscore(attr), true)}'`);

      if (index === array.length - 1) {
        str += `\n${indent(2)}];`;
      } else {
        str += ',\n';
      }

      return str;
    }, '');

  return `
import { Controller } from 'lux-framework';

class ${name}Controller extends Controller {
${body}
}

export default ${name}Controller;
  `.substr(1).trim();
};
