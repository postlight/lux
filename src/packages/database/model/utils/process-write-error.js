/* @flow */

import { UNIQUE_CONSTRAINT } from '../../constants'
import { UniqueConstraintError } from '../../errors'

/**
 * @private
 */
export default function resolveWriteError(err: Error) {
  const { message } = err

  if (UNIQUE_CONSTRAINT.test(message)) {
    return new UniqueConstraintError(message)
  }

  return err
}
