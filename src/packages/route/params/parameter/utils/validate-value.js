// @flow
import { ParameterValueError } from '../errors';

import type Parameter from '../index';

function validateOne(param: Parameter, values: Set<mixed>, value: mixed): true {
  if (!values.has(value)) {
    throw new ParameterValueError(param, value);
  }

  return true;
}

export default function validateValue(param: Parameter, value: mixed): true {
  const { values } = param;

  if (values) {
    if (Array.isArray(value)) {
      for (const item of value) {
        validateOne(param, values, item);
      }
    } else {
      validateOne(param, values, value);
    }
  }

  return true;
}
