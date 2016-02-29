const memoized = new WeakMap();

export function memoizationFor(obj) {
  let table = memoized.get(obj);

  if (!table) {
    table = Object.create(null);

    memoized.set(obj, table);
  }
  return table;
}

export default function memoize(target, key, desc) {
  const { get, set } = desc;

  return {
    ...desc,
    get() {
      let value;
      const table = memoizationFor(this);

      if (key in table) {
        value = table[key];
      } else {
        value = get.call(this);
        table[key] = value;
      }
      return value;
    },

    set(value) {
      const table = memoizationFor(this);

      set.call(this, value);
      table[key] = value;
    }
  };
}
