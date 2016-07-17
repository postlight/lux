// @flow
import sanitizeRead from './utils/sanitize-read';
import sanitizeWrite from './utils/sanitize-write';

import type { Request } from '../../server';

const READ_METHODS = /^(GET|HEAD|OPTIONS)$/;

export function sanitize(req: Request): void {
  let params;

  if (READ_METHODS.test(req.method)) {
    params = sanitizeRead(req);
  } else {
    params = sanitizeWrite(req);
  }

  req.params = params;
}
