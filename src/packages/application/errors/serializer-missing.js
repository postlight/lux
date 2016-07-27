// @flow

/**
 * @private
 */
class SerializerMissingError extends Error {
  constructor(resource: string) {
    super(`Could not resolve serializer by name '${resource}'`);
  }
}

export default SerializerMissingError;
