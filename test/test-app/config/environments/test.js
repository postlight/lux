import { Adapters } from 'LUX_LOCAL';

export default {
  adapter: Adapters.mock,
  logging: {
    level: 'WARN',
    format: 'text',
    enabled: false,
    filter: {
      params: []
    }
  }
};
