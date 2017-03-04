/* @flow */

/**
 * @private
 */
export default function log(data: string | Error): void {
  if (data instanceof Error) {
    process.stdout.write(`${data.stack || data.message}\n`);
  } else {
    process.stderr.write(`${data}\n`);
  }
}
