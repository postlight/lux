/* @flow */

import Validation, { ValidationError } from '../../validation';
import type { Model } from '../../index';

/**
 * @private
 */
export default function validate(instance: Model): true {
  return Array
    .from(instance.dirtyAttributes)
    .map(([key, value]) => ({
      key,
      value,
      validator: Reflect.get(instance.constructor.validates, key)
    }))
    .filter(({ validator }) => validator)
    .map(props => new Validation(props))
    .reduce((result, validation) => {
      if (!validation.isValid()) {
        throw new ValidationError(validation.key, String(validation.value));
      }

      return result;
    }, true);
}
