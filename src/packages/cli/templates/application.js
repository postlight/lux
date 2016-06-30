// @flow
import { classify } from 'inflection';

import template from '../../template';
import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default (name: string): string => {
  name = classify(underscore(name));

  return template`
    import { Application } from 'lux-framework';

    class ${name} extends Application {

    }

    export default ${name};
  `;
};
