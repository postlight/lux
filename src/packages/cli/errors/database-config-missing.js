// @flow
class DatabaseConfigMissingError extends ReferenceError {
  constructor(environment: string) {
    super(`Could not find database config for environment "${environment}".`);
  }
}

export default DatabaseConfigMissingError;
