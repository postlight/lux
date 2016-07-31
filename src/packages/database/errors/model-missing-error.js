// @flow

/**
 * @private
 */
class ModelMissingError extends Error {
  constructor(name: string) {
    super(`Could not resolve model by name '${name}'`);
  }
}

export default ModelMissingError;
