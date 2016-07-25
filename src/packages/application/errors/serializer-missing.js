// @flow

/**
 * @private
 */
class SerializerMissingError extends Error {
  constructor(resource: string): SerializerMissingError {
    super(`Could not resolve serializer by name '${resource}'`);
    return this;
  }
}

export default SerializerMissingError;
