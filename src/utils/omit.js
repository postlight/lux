const { keys } = Object;

export default function omit(obj, ...omitted) {
  return keys(obj)
    .filter(key => omitted.indexOf(key) < 0)
    .reduce((result, key) => {
      const value = obj[key];

      return typeof value === 'undefined' ? result : {
        ...result,
        [key]: value
      };
    }, {});
}
