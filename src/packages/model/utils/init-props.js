const { isArray } = Array;
const { create, entries, defineProperties } = Object;

const refs = new WeakMap();

function tableFor(instance) {
  let table = refs.get(instance);

  if (!table) {
    table = create(null);
    refs.set(instance, table);
  }

  return table;
}

export default function initProps(prototype, attributes, relationships) {
  const props = create(null);

  entries(attributes)
    .reduce((hash, [key, { type, nullable, defaultValue }]) => {
      hash[key] = {
        get() {
          const table = tableFor(this);

          return table[key] || defaultValue;
        },

        set(value) {
          const table = tableFor(this);

          if (type === 'tinyint') {
            value = Boolean(value);
          } else if (!value && !nullable) {
            return;
          }

          table[key] = value;
        }
      };

      return hash;
    }, props);

  entries(relationships)
    .reduce((hash, [key, { type, model }]) => {
      if (type === 'hasMany') {
        hash[key] = {
          get() {
            const table = tableFor(this);

            return table[key] || [];
          },

          set(value) {
            const table = tableFor(this);

            if (isArray(value)) {
              table[key] = value.map(record => new model(record));
            }
          }
        };
      } else {
        hash[key] = {
          get() {
            return tableFor(this)[key] || null;
          },

          set(record) {
            tableFor(this)[key] = record ? new model(record) : undefined;
          }
        };
      }

      return hash;
    }, props);

  defineProperties(prototype, props);
}
