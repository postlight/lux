// @flow

/**
 * @private
 */
export default function normalizePort(port: ?(void | string | number)): number {
  switch (typeof port) {
    case 'string':
      return Number.parseInt(port, 10);

    case 'number':
      return Math.abs(port);

    default:
      return 4000;
  }
}
