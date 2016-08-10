// @flow
import { expect } from 'chai';

import transformKeys, {
  camelizeKeys,
  dasherizeKeys,
  underscoreKeys
} from '../transform-keys';

describe('#camelizeKeys()', () => {
  const subjectA = {
    key_a: 1, // eslint-disable-line camelcase
    key_b: 2, // eslint-disable-line camelcase
    key_c: 3, // eslint-disable-line camelcase

    key_d: { // eslint-disable-line camelcase
      key_a: 1 // eslint-disable-line camelcase
    }
  };

  const subjectB = {
    'key-a': 1,
    'key-b': 2,
    'key-c': 3,

    'key-d': {
      'key-a': 1
    }
  };

  it('can shallow camelize an objects keys', () => {
    expect(camelizeKeys(subjectA)).to.deep.equal({
      keyA: 1,
      keyB: 2,
      keyC: 3,

      keyD: {
        key_a: 1 // eslint-disable-line camelcase
      }
    });

    expect(camelizeKeys(subjectB)).to.deep.equal({
      keyA: 1,
      keyB: 2,
      keyC: 3,

      keyD: {
        'key-a': 1
      }
    });
  });

  it('can deep camelize an objects keys', () => {
    expect(camelizeKeys(subjectA, true)).to.deep.equal({
      keyA: 1,
      keyB: 2,
      keyC: 3,

      keyD: {
        keyA: 1
      }
    });

    expect(camelizeKeys(subjectB, true)).to.deep.equal({
      keyA: 1,
      keyB: 2,
      keyC: 3,

      keyD: {
        keyA: 1
      }
    });
  });
});

describe('#dasherizeKeys()', () => {
  const subjectA = {
    key_a: 1, // eslint-disable-line camelcase
    key_b: 2, // eslint-disable-line camelcase
    key_c: 3, // eslint-disable-line camelcase

    key_d: { // eslint-disable-line camelcase
      key_a: 1 // eslint-disable-line camelcase
    }
  };

  const subjectB = {
    keyA: 1,
    keyB: 2,
    keyC: 3,

    keyD: {
      keyA: 1
    }
  };

  it('can shallow dasherize an objects keys', () => {
    expect(dasherizeKeys(subjectA)).to.deep.equal({
      'key-a': 1,
      'key-b': 2,
      'key-c': 3,

      'key-d': {
        key_a: 1 // eslint-disable-line camelcase
      }
    });

    expect(dasherizeKeys(subjectB)).to.deep.equal({
      'key-a': 1,
      'key-b': 2,
      'key-c': 3,

      'key-d': {
        keyA: 1
      }
    });
  });

  it('can deep dasherize an objects keys', () => {
    expect(dasherizeKeys(subjectA, true)).to.deep.equal({
      'key-a': 1,
      'key-b': 2,
      'key-c': 3,

      'key-d': {
        'key-a': 1
      }
    });

    expect(dasherizeKeys(subjectB, true)).to.deep.equal({
      'key-a': 1,
      'key-b': 2,
      'key-c': 3,

      'key-d': {
        'key-a': 1
      }
    });
  });
});

describe('#underscoreKeys()', () => {
  const subjectA = {
    keyA: 1,
    keyB: 2,
    keyC: 3,

    keyD: {
      keyA: 1
    }
  };

  const subjectB = {
    'key-a': 1,
    'key-b': 2,
    'key-c': 3,

    'key-d': {
      'key-a': 1
    }
  };

  it('can shallow underscore an objects keys', () => {
    expect(underscoreKeys(subjectA)).to.deep.equal({
      key_a: 1, // eslint-disable-line camelcase
      key_b: 2, // eslint-disable-line camelcase
      key_c: 3, // eslint-disable-line camelcase

      key_d: { // eslint-disable-line camelcase
        keyA: 1
      }
    });

    expect(underscoreKeys(subjectB)).to.deep.equal({
      key_a: 1, // eslint-disable-line camelcase
      key_b: 2, // eslint-disable-line camelcase
      key_c: 3, // eslint-disable-line camelcase

      key_d: { // eslint-disable-line camelcase
        'key-a': 1
      }
    });
  });

  it('can deep underscore an objects keys', () => {
    expect(underscoreKeys(subjectA, true)).to.deep.equal({
      key_a: 1, // eslint-disable-line camelcase
      key_b: 2, // eslint-disable-line camelcase
      key_c: 3, // eslint-disable-line camelcase

      key_d: { // eslint-disable-line camelcase
        key_a: 1 // eslint-disable-line camelcase
      }
    });

    expect(underscoreKeys(subjectB, true)).to.deep.equal({
      key_a: 1, // eslint-disable-line camelcase
      key_b: 2, // eslint-disable-line camelcase
      key_c: 3, // eslint-disable-line camelcase

      key_d: { // eslint-disable-line camelcase
        key_a: 1 // eslint-disable-line camelcase
      }
    });
  });
});

describe('#transformKeys()', () => {
  const subject = {
    keyA: 1,
    keyB: 2,
    keyC: 3,

    keyD: {
      keyA: 1
    }
  };

  it('can shallow transform an objects keys', () => {
    const result = transformKeys(subject, key => `${key}Transformed`);

    expect(result).to.deep.equal({
      keyATransformed: 1,
      keyBTransformed: 2,
      keyCTransformed: 3,

      keyDTransformed: {
        keyA: 1
      }
    });
  });

  it('can deep transform an objects keys', () => {
    const result = transformKeys(subject, key => `${key}Transformed`, true);

    expect(result).to.deep.equal({
      keyATransformed: 1,
      keyBTransformed: 2,
      keyCTransformed: 3,

      keyDTransformed: {
        keyATransformed: 1
      }
    });
  });

  it('does not mutate the source object', () => {
    expect(subject).to.deep.equal({
      keyA: 1,
      keyB: 2,
      keyC: 3,

      keyD: {
        keyA: 1
      }
    });
  });
});
