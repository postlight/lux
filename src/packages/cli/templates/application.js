import { classify, pluralize } from 'inflection';

export default (name) => {
  name = classify(name.replace('-', '_'));

  return `
import Framework from 'framework';

class ${name} extends Framework {

}

export default ${name};
  `.substr(1).trim();
};
