// @flow
import { NODE_ENV } from '../../constants';
import { http } from '../adapter';

import type { Config } from './interfaces';

export function createDefaultConfig(): Config {
  const isTestENV = NODE_ENV === 'test';
  const isProdENV = NODE_ENV === 'production';

  return {
    server: {
      cors: {
        enabled: false
      }
    },
    adapter: http,
    logging: {
      level: isProdENV ? 'INFO' : 'DEBUG',
      format: isProdENV ? 'json' : 'text',
      enabled: !isTestENV,

      filter: {
        params: []
      }
    }
  };
}

export type { Config } from './interfaces';
