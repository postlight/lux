import fetch from 'isomorphic-fetch';

import { MIME_TYPE } from '../../src/packages/jsonapi';

export default (url, opts = {}) => fetch(url, {
  ...opts,
  headers: new Headers({
    'Accept': MIME_TYPE,
    'Content-Type': MIME_TYPE
  })
});
