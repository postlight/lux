// @flow
import validateType from './utils/validate-type';
import validateValue from './utils/validate-value';

import type { Parameter$opts } from './interfaces';

class Parameter {
  path: string;

  type: void | string;

  values: void | Set<mixed>;

  required: boolean;

  constructor({ path, type, values, required }: Parameter$opts): Parameter {
    Object.assign(this, {
      path,
      type,
      required: Boolean(required)
    });

    if (values) {
      this.values = new Set(values);
    }

    return this;
  }

  validate(value: mixed): boolean {
    validateType(this, value);
    validateValue(this, value);

    return true;
  }
}

export default Parameter;
