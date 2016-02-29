export default function omit(obj, ...keys) {
  const result = {};
  let value;

  for (let key in obj) {
    if (!keys.includes(key)) {
      value = obj[key];

      if (value !== undefined) {
        result[key] = value;
      }
    }
  }

  return result;
}
