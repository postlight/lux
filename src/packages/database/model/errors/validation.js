// @flow

/**
 * @private
 */
class ValidationError extends Error {
  constructor(key: string, value: string): ValidationError {
    super(`Validation failed for ${key}: ${value}`);
    return this;
  }
}

export default ValidationError;
