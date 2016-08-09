import { NODE_ENV } from '../../constants';

const isTestENV = NODE_ENV === 'test';
const isProdENV = NODE_ENV === 'production';

export default {
  logging: {
    level: isProdENV ? 'INFO' : 'DEBUG',
    format: isProdENV ? 'json' : 'text',
    enabled: (!isTestENV).toString(),
    filter: {
      params: []
    }
  }
};
