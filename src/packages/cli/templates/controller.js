import { classify, pluralize } from 'inflection';

export default (name) => {
  name = classify(name.replace('-', '_'));

  if (name !== 'Application') {
    name = pluralize(name);
  }

  return `
import { Controller, action } from 'framework';

class ${name}Controller extends Controller {

}

export default ${name}Controller;
  `.substr(1).trim();
};
