// @flow
import { JSONAPI } from '../../../constants';

import createServerError from '../utils/create-server-error';
import { line } from '../../logger';

class NotAcceptableError extends TypeError {
  constructor(contentType: string): NotAcceptableError {
    super(line`
      Accept: '${contentType}' is not supported. Please use ${JSONAPI} instead.
    `);

    return this;
  }
}

export default createServerError(NotAcceptableError, 406);
