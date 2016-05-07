import { classify } from 'inflection';

export default (name) => {
  name = classify(name.replace('-', '_'));

  return `
import { Model } from 'lux-framework';

class ${name} extends Model {

}

export default ${name};

  `.substr(1).trim();
};
