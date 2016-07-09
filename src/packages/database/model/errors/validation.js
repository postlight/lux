class ValidationError extends Error {
  constructor(key, value) {
    super(`Validation failed for ${key}: ${value}`);
  }
}

export default ValidationError;
