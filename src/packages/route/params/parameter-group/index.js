// @flow
import { FreezeableMap } from '../../../freezeable';

import { InvalidParameterError } from '../errors';

import isNull from '../../../../utils/is-null';
import entries from '../../../../utils/entries';
import setType from '../../../../utils/set-type';
import validateType from '../utils/validate-type';
import hasRequiredParams from './utils/has-required-params';

import type { ParameterLike, ParameterLike$opts } from '../index';

/**
 * @private
 */
class ParameterGroup extends FreezeableMap<string, ParameterLike> {
  type: string;

  path: string;

  required: boolean;

  sanitize: boolean;

  constructor(contents: Array<[string, ParameterLike]>, {
    path,
    required,
    sanitize
  }: ParameterLike$opts) {
    super(contents);

    Object.assign(this, {
      path,
      type: 'object',
      required: Boolean(required),
      sanitize: Boolean(sanitize)
    });

    this.freeze();
  }

  validate<V: Object>(params: V): V  {
    return setType(() => {
      const validated = {};

      if (isNull(params)) {
        return params;
      }

      if (validateType(this, params) && hasRequiredParams(this, params)) {
        const { sanitize } = this;
        let { path } = this;

        if (path.length) {
          path = `${path}.`;
        }

        for (const [key, value] of entries(params)) {
          const match = this.get(key);

          if (match) {
            validated[key] = match.validate(value);
          } else if (!match && !sanitize) {
            throw new InvalidParameterError(`${path}${key}`);
          }
        }
      }

      return validated;
    });
  }
}

export default ParameterGroup;
