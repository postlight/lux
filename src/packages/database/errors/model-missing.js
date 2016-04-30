class ModelMissingError extends Error {
  constructor(name) {
    super(`Could not resolve model by name '${name}'`);
  }
}

export default ModelMissingError;
