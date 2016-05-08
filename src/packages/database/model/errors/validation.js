class ValidationError extends Error {
  constructor(key, value) {
    return super(`Validation failed for ${key}: ${value}`);
  }
}

export default ValidationError;
