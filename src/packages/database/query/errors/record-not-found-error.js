/* @flow */

import createServerError from '../../../../errors/utils/create-server-error'
import stringify from '@lux/utils/stringify'
import typeof { Model } from '@lux/packages/database'

class RecordNotFoundError extends Error {
  constructor({ name, primaryKey }: Model, primaryKeyValue: mixed) {
    const value = stringify(primaryKeyValue)

    super(`Could not find ${name} with ${primaryKey} ${value}.`)
  }
}

export default createServerError(RecordNotFoundError, 404)
