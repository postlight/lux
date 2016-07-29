import relatedFor from './related-for';

import type { Model } from '../../index';

export default function setInverse(owner: Model, value: Array<Model> | ?Model, {
  type,
  inverse,
  foreignKey,
  inverseModel
}: {
  type: 'belongsTo' | 'hasOne' | 'hasMany';
  inverse: string;
  foreignKey: string;
  inverseModel: typeof Model;
}) {
  const primaryKey = Reflect.get(owner, owner.constructor.primaryKey);

  switch (type) {
    case 'hasMany':
      if (Array.isArray(value)) {
        const { type: inverseType } = inverseModel.relationshipFor(inverse);

        for (const record of value) {
          const related = relatedFor(record);

          if (owner !== related.get(inverse)) {
            relatedFor(record).set(inverse, owner);

            if (inverseType === 'belongsTo') {
              Reflect.set(record, foreignKey, primaryKey);
            }
          }
        }
      }
      break;

    case 'hasOne':
    case 'belongsTo':
      if (value) {
        const { type: inverseType } = inverseModel.relationshipFor(inverse);
        const related = relatedFor(value);
        let inverseValue = related.get(inverse);

        if (inverseType === 'hasMany') {
          if (!Array.isArray(inverseValue)) {
            inverseValue = [];
          }

          if (!inverseValue.includes(owner)) {
            inverseValue = [...inverseValue, owner];
          }
        } else {
          if (owner !== inverseValue) {
            inverseValue = owner;

            if (inverseType === 'belongsTo') {
              Reflect.set(value, foreignKey, primaryKey);
            }
          }
        }

        related.set(inverse, inverseValue);
      }
      break;
  }
}
