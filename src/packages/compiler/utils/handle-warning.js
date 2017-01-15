// @flow

/**
 * @private
 */
type CompilerWarning = {
  code: string;
  message: string;
};

/**
 * @private
 */
export default function handleWarning(warning: CompilerWarning): void {
  if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
    return;
  }
  // eslint-disable-next-line no-console
  console.warn(warning.message);
}
