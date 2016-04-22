import { expect } from 'chai';

import camelizeKeys from '../../../src/utils/camelize-keys';

describe('Unit: util camelizeKeys', () => {
  const subject = {
    'value-a': 'a',
    'value_b': 'b',
    'value-c': {
      'value-c_d': 'cd'
    }
  };

  it('shallow converts an object\'s keys to lower camel case', () => {
    const result = camelizeKeys(subject);

    expect(result).to.deep.equal({
      valueA: 'a',
      valueB: 'b',
      valueC: {
        'value-c_d': 'cd'
      }
    });
  });

  it('deep converts an object\'s keys to lower camel case', () => {
    const result = camelizeKeys(subject, true);

    expect(result).to.deep.equal({
      valueA: 'a',
      valueB: 'b',
      valueC: {
        valueCD: 'cd'
      }
    });
  });

  it('does not mutate the source object', () => {
    camelizeKeys(subject);
    camelizeKeys(subject, true);

    expect(subject).to.deep.equal({
      'value-a': 'a',
      'value_b': 'b',
      'value-c': {
        'value-c_d': 'cd'
      }
    });
  });
});
