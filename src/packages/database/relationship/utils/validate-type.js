// @flow
import isNull from '../../../../utils/is-null';

import type { Model } from '../../index';

function validateOne(model: Model, value: void | ?mixed): boolean {
  return isNull(value) || value instanceof model;
}

export default function validateType(model: Model, value: mixed): boolean {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!validateOne(model, item)) {
        return false;
      }
    }

    return true;
  }

  return validateOne(model, value);
}
