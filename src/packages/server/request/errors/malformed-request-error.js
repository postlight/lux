// @flow
import createServerError from '../../utils/create-server-error';
import { line } from '../../../logger';

class MalformedRequestError extends TypeError {
  constructor(): MalformedRequestError {
    super(line`
      There was an error parsing the request body. Please make sure that the
      request body is a valid JSON API document.
    `);

    return this;
  }
}

export default createServerError(MalformedRequestError, 400);
