/* @flow */

/**
 * @private
 */
class ValidationError extends Error {
  constructor(key: string, value: string) {
    super(`Validation failed for ${key}: ${value}`)
  }
}

export default ValidationError
