// @flow
import template from '../../template';

/**
 * @private
 */
export default (name: string, env: string): string => {
  const isTestENV = env === 'test';
  const isProdENV = env === 'production';

  return template`
    export default {
      logging: {
        level: ${isProdENV ? 'INFO' : 'DEBUG'},
        format: ${isProdENV ? 'json' : 'text'},
        enabled: ${!isTestENV}
      }
    };
  `;
};
