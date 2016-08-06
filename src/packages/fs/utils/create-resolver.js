// @flow

/**
 * @private
 */
export default function createResolver(
  resolve: (data: any) => void,
  reject: (err: Error) => void
) {
  return function fsResolver(err: ?Error, ...args: Array<any>) {
    const [data] = args;

    if (err) {
      return reject(err);
    }

    resolve(args.length > 1 ? args : data);
  };
}
