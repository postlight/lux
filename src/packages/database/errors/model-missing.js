// @flow
class ModelMissingError extends Error {
  constructor(name: string): ModelMissingError {
    super(`Could not resolve model by name '${name}'`);
    return this;
  }
}

export default ModelMissingError;
