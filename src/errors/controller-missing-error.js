// @flow

/**
 * @private
 */
class ControllerMissingError extends ReferenceError {
  constructor(resource: string) {
    super(`Could not resolve controller by name '${resource}'`);
  }
}

export default ControllerMissingError;
