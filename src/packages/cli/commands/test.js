// @flow
import { EOL } from 'os';

/**
 * @private
 */
export function test(): Promise<void> {
  process.stdout.write('Coming Soon!');
  process.stdout.write(EOL);

  return Promise.resolve();
}
