// @flow
import { createServerError } from '../../server';

class UniqueConstraintError extends Error {

}

export default createServerError(UniqueConstraintError, 409);
