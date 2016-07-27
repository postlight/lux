// @flow
import { UNIQUE_CONSTRAINT } from '../../constants';

import { UniqueConstraintError } from '../../errors';

export default function resolveWriteError(err: Error) {
  const { message } = err;

  if (UNIQUE_CONSTRAINT.test(message)) {
    err = new UniqueConstraintError(message);
  }

  return err;
}
