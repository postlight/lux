// @flow
import merge from '../../../utils/merge';

const IGNORE_WARNING = /^treating '.+' as external dependency$/i;

export function createRollupConfig<T: Object>(options: T): T {
  return merge({
    acorn: {
      sourceType: 'module',
      ecmaVersion: 2017,
      allowReserved: true,
      preserveParens: true
    },
    entry: '',
    onwarn: warning => {
      if (IGNORE_WARNING.test(warning)) {
        return;
      }

      process.stderr.write(`${warning}\n`);
    },
    preferConst: true
  }, options);
}

export function createBundleConfig<T: Object>(options: T): T {
  return merge({
    format: 'cjs',
    sourceMap: true,
    useStrict: false
  }, options);
}
