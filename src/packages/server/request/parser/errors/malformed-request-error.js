// @flow
import createServerError from '../../../utils/create-server-error';
import { line } from '../../../../logger';

/**
 * @private
 */
class MalformedRequestError extends SyntaxError {
  constructor() {
    super(line`
      There was an error parsing the request body. Please make sure that the
      request body is a valid JSON API document.
    `);
  }
}

export default createServerError(MalformedRequestError, 400);
