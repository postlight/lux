// @flow
import { FreezeableMap } from '../../../freezeable';

import { InvalidParameterError } from '../errors';

import entries from '../../../../utils/entries';
import validateType from '../utils/validate-type';
import hasRequiredParams from './utils/has-required-params';

import type {
  ParameterGroup$opts,
  ParameterGroup$contents
} from './interfaces';

/**
 * @private
 */
class ParameterGroup extends FreezeableMap<string, ParameterGroup$contents> {
  type: string;

  path: string;

  required: boolean;

  constructor(contents: Array<[string, ParameterGroup$contents]>, {
    path,
    required
  }: ParameterGroup$opts): ParameterGroup {
    super(contents);

    Object.assign(this, {
      path,
      type: 'object',
      required: Boolean(required)
    });

    return this.freeze();
  }

  validate(params: Object): true {
    if (validateType(this, params) && hasRequiredParams(this, params)) {
      const { path } = this;

      for (const [key, value] of entries(params)) {
        const match = this.get(key);

        if (!match) {
          throw new InvalidParameterError(path.length ? `${path}.${key}` : key);
        }

        match.validate(value);
      }
    }

    return true;
  }
}

export default ParameterGroup;
