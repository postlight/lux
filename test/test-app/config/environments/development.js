import { Adapters } from 'LUX_LOCAL';

export default {
  adapter: Adapters.mock,
  logging: {
    level: 'DEBUG',
    format: 'text',
    enabled: true,
    filter: {
      params: []
    }
  }
};
