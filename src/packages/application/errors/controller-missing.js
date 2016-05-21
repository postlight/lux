class ControllerMissingError extends Error {
  constructor(resource) {
    return super(`Could not resolve controller by name '${resource}'`);
  }
}

export default ControllerMissingError;
