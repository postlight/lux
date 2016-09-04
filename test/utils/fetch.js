import fetch from 'isomorphic-fetch';

import { MIME_TYPE } from '../../src/packages/jsonapi';

import pick from '../../src/utils/pick';

export default async (path, opts = {}) => {
  const response = await fetch(`http://localhost:4000${path}`, {
    ...opts,
    headers: new Headers({
      'Accept': MIME_TYPE,
      'Content-Type': MIME_TYPE
    })
  });

  return {
    body: await response.json(),
    ...pick(response,
      'ok',
      'url',
      'type',
      'status',
      'headers',
      'bodyUsed',
      'statusText',
    )
  };
};
