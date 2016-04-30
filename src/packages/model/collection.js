const { entries } = Object;

function insert(collection, records) {
  for (let i = 0; i < collection.length; i++) {
    collection[i] = records[i];
  }
}

class Collection extends Array {
  constructor({ model, records = [], related = {} } = {}) {
    const { length } = records;
    const { modelName } = model;

    super(length);
    insert(this, records);

    return this.map(row => {
      entries(related)
        .forEach(([name, relatedRecords]) => {
          const match = relatedRecords
            .filter(({ [`${modelName}.id`]: id }) => id === row.id)
            .map(relatedRecord => {
              return entries(relatedRecord).reduce((rR, [key, value]) => {
                if (key.indexOf('.') >= 0) {
                  return {
                    ...rR,
                    [key.replace(`${name}.`, '')]: value
                  };
                } else {
                  return rR;
                }
              }, {});
            });

          if (match.length) {
            row[name] = match;
          }
        });

      row = entries(row)
        .reduce((r, [key, value]) => {
          if (/^.+\.id$/.test(key) && !value) {
            return r;
          } else if (key.indexOf('.') >= 0) {
            const [a, b] = key.split('.');
            let parent = r[a];

            if (!parent) {
              parent = {};
            }

            key = a;
            value = {
              ...parent,
              [b]: value
            };
          }

          return {
            ...r,
            [key]: value
          };
        }, {});

      return new model(row);
    });
  }
}

export default Collection;
