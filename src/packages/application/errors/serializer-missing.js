class SerializerMissingError extends Error {
  constructor(resource) {
    super(`Could not resolve serializer by name '${resource}'`);
  }
}

export default SerializerMissingError;
