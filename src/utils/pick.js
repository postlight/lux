export default function pick(obj, ...keys) {
  const result = {};
  let value;

  for (let key of keys) {
    value = obj[key];

    if (typeof value !== 'undefined') {
      result[key] = value;
    }
  }

  return result;
}
