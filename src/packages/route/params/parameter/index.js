// @flow
import { FreezeableSet } from '../../../freezeable';

import validateType from './utils/validate-type';
import validateValue from './utils/validate-value';

import type { Parameter$opts } from './interfaces';

class Parameter extends FreezeableSet<mixed> {
  path: string;

  type: void | string;

  required: boolean;

  constructor({ path, type, values, required }: Parameter$opts): Parameter {
    super(values);

    Object.assign(this, {
      path,
      type,
      required: Boolean(required)
    });

    return this.freeze();
  }

  validate(value: mixed): boolean {
    validateType(this, value);
    validateValue(this, value);

    return true;
  }
}

export default Parameter;
