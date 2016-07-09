class ControllerMissingError extends Error {
  constructor(resource) {
    super(`Could not resolve controller by name '${resource}'`);
  }
}

export default ControllerMissingError;
