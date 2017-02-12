// @flow
import { NODE_ENV } from '../../constants';
import { mock, http } from '../adapter';
// eslint-disable-next-line no-duplicate-imports
import type { AdapterFactory } from '../adapter';
import type { Config as LoggerConfig } from '../logger';

export type Config = {
  server: {
    cors: {
      enabled: boolean;
    };
  };
  adapter: AdapterFactory;
  logging: LoggerConfig;
};

export function createDefaultConfig(): Config {
  const isTestENV = NODE_ENV === 'test';
  const isProdENV = NODE_ENV === 'production';

  return {
    server: {
      cors: {
        enabled: false,
      },
    },
    adapter: isTestENV ? mock : http,
    logging: {
      level: isProdENV ? 'INFO' : 'DEBUG',
      format: isProdENV ? 'json' : 'text',
      enabled: !isTestENV,
      filter: {
        params: [],
      },
    },
  };
}
