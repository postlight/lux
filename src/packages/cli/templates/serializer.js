import { classify, pluralize } from 'inflection';

export default (name) => {
  name = classify(name.replace('-', '_'));

  if (name !== 'Application') {
    name = pluralize(name);
  }

  return `
import { Serializer } from 'lux';

class ${name}Serializer extends Serializer {

}

export default ${name}Serializer;
  `.substr(1).trim();
};
