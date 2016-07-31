// @flow
class ConfigMissingError extends Error {
  constructor(environment: string) {
    super(`Database config not found for environment ${environment}.`);
  }
}

export default ConfigMissingError;
