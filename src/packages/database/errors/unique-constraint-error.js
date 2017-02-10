// @flow
import createServerError from '../../../errors/utils/create-server-error';

export default createServerError(
  class UniqueConstraintError extends Error {},
  409
);
