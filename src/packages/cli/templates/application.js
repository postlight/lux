import { classify, pluralize } from 'inflection';

export default (name) => {
  name = classify(name.replace('-', '_'));

  return `
import Lux from 'lux';

class ${name} extends Lux {

}

export default ${name};
  `.substr(1).trim();
};
