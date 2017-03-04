/* @flow */


/**
 * @private
 */
export default function uniq<T: any, U: Array<T>>(
  src: U,
  ...keys: Array<string>
): Array<T> {
  const hasKeys = Boolean(keys.length);

  return src.filter((x, xIdx, arr) => {
    let lastIdx;

    if (hasKeys) {
      lastIdx = arr.findIndex((y, yIdx) => (
        yIdx > xIdx || keys.every(key => x[key] === y[key])
      ));
    } else {
      lastIdx = src.lastIndexOf(x);
    }

    return xIdx === lastIdx;
  });
}
