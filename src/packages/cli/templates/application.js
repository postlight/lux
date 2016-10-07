// @flow
import { classify } from 'inflection';

import template from '../../template';
import chain from '../../../utils/chain';
import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default (name: string): string => {
  const normalized = chain(name)
    .pipe(underscore)
    .pipe(classify)
    .value();

  return template`
    import { Application } from 'lux-framework';

    class ${normalized} extends Application {

    }

    export default ${normalized};
  `;
};
