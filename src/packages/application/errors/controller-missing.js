// @flow

/**
 * @private
 */
class ControllerMissingError extends Error {
  constructor(resource: string) {
    super(`Could not resolve controller by name '${resource}'`);
  }
}

export default ControllerMissingError;
