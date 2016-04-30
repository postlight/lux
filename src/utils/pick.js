export default function pick(obj, ...keys) {
  return keys.reduce((result, key) => {
    const value = obj[key];

    return typeof value === 'undefined' ? result : {
      ...result,
      [key]: value
    };
  }, {});
}
