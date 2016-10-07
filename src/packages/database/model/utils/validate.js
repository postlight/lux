// @flow
import Validation, { ValidationError } from '../../validation';
import pick from '../../../../utils/pick';
import entries from '../../../../utils/entries';
import type { Model } from '../../index';

/**
 * @private
 */
export default function validate(instance: Model) {
  const { initialized, constructor: model } = instance;
  let { validates } = model;

  if (initialized) {
    validates = pick(validates, ...Array.from(instance.dirtyAttributes));
  }

  for (const [key, validator] of entries(validates)) {
    const value = Reflect.get(instance, key);
    const validation = new Validation({
      key,
      value,
      validator
    });

    if (!validation.isValid()) {
      throw new ValidationError(key, value);
    }
  }

  return true;
}
