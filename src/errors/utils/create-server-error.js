/* @flow */

type ServerError<T: Error> = T & {
  statusCode: number;
};

/**
 * @private
 */
export default function createServerError<T: Error>(
  Source: Class<T>,
  statusCode: number
): Class<ServerError<T>> {
  const Target = class extends Source {
    statusCode: number;
  };

  Object.defineProperty(Target, 'name', {
    value: Source.name,
  });

  Object.defineProperty(Target.prototype, 'statusCode', {
    value: statusCode,
  });

  // $FlowIgnore
  return Target;
}
