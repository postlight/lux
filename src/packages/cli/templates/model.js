import { classify } from 'inflection';

export default (name) => {
  name = classify(name.replace('-', '_'));

  return `
import { Model, DataTypes } from 'lux';

class ${name} extends Model {

}

export default ${name};
  `.substr(1).trim();
};
