import Validation from '../../validation';
import { ValidationError } from '../errors';

import pick from '../../../../utils/pick';
import entries from '../../../../utils/entries';

/**
 * @private
 */
export default function validate(instance) {
  const { initialized, constructor: model } = instance;
  let { validates } = model;

  if (initialized) {
    validates = pick(validates, ...instance.dirtyAttributes);
  }

  for (const [key, validator] of entries(validates)) {
    const value = instance[key];
    const { isValid } = new Validation({
      key,
      value,
      model,
      validator
    });

    if (!isValid) {
      throw new ValidationError(key, value);
    }
  }

  return true;
}
