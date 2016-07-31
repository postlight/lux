// @flow
import { createServerError } from '../../../server';

import stringify from '../../../../utils/stringify';

import typeof { Model } from '../../../database';

class RecordNotFoundError extends Error {
  constructor({ name, primaryKey }: Model, primaryKeyValue: mixed) {
    primaryKeyValue = stringify(primaryKeyValue);

    super(`Could not find ${name} with ${primaryKey} ${primaryKeyValue}.`);
  }
}

export default createServerError(RecordNotFoundError, 404);
