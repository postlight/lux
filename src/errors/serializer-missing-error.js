// @flow

/**
 * @private
 */
class SerializerMissingError extends ReferenceError {
  constructor(resource: string) {
    super(`Could not resolve serializer by name '${resource}'`);
  }
}

export default SerializerMissingError;
