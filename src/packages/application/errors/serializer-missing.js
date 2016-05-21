class SerializerMissingError extends Error {
  constructor(resource) {
    return super(`Could not resolve serializer by name '${resource}'`);
  }
}

export default SerializerMissingError;
