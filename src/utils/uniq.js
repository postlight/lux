// @flow

/**
 * @private
 */
export default function uniq(
  src: Array<any>,
  ...keys: Array<string>
): Array<any> {
  const hasKeys = Boolean(keys.length);

  return src.filter((x, xIdx, arr) => {
    let lastIdx;

    if (hasKeys) {
      lastIdx = arr.findIndex((y, yIdx) => {
        return yIdx > xIdx || keys.every(key => x[key] === y[key]);
      });
    } else {
      lastIdx = src.lastIndexOf(x);
    }

    return xIdx === lastIdx;
  });
}
