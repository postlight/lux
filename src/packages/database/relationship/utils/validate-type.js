/* @flow */

import isNull from '../../../../utils/is-null';
import type { Model } from '../../index';

function validateOne(model: Class<Model>, value: void | ?mixed) {
  return isNull(value) || model.isInstance(value);
}

export default function validateType(model: Class<Model>, value: mixed) {
  if (Array.isArray(value)) {
    return value.every(item => validateOne(model, item));
  }

  return validateOne(model, value);
}
