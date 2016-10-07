// @flow

/**
 * @private
 */
export default function createResolver(
  resolve: (data: any) => void,
  reject: (err: Error) => void
): (err: ?Error, ...args: Array<any>) => void {
  return function fsResolver(err: ?Error, ...args: Array<any>) {
    const [data] = args;

    if (err) {
      reject(err);
      return;
    }

    resolve(args.length > 1 ? args : data);
  };
}
