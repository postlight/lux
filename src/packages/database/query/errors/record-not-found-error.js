// @flow
import { createServerError } from '../../../server';
import stringify from '../../../../utils/stringify';
import typeof { Model } from '../../../database';

class RecordNotFoundError extends Error {
  constructor({ name, primaryKey }: Model, primaryKeyValue: mixed) {
    super(
      `Could not find ${name} with ${primaryKey} ${stringify(primaryKeyValue)}.`
    );
  }
}

export default createServerError(RecordNotFoundError, 404);
