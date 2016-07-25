// @flow

/**
 * @private
 */
class ControllerMissingError extends Error {
  constructor(resource: string): ControllerMissingError {
    super(`Could not resolve controller by name '${resource}'`);
    return this;
  }
}

export default ControllerMissingError;
