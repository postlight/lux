class ModelMissingError extends Error {
  constructor(name) {
    return super(`Could not resolve model by name '${name}'`);
  }
}

export default ModelMissingError;
