// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import uniq from '../uniq';

describe('#uniq()', () => {
  it('removes duplicate items from an `Array`', () => {
    expect(uniq([1, 1, 2, 2, 3, 3])).to.deep.equal([1, 2, 3]);
  });

  it('removes objects with a non-unique key-value pair from an `Array`', () => {
    const subject = [
      {
        id: 1,
        name: 'Test 1'
      },
      {
        id: 1,
        name: 'Test One'
      },
      {
        id: 2,
        name: 'Test 2'
      }
    ];

    expect(uniq(subject, 'id')).to.deep.equal([
      {
        id: 1,
        name: 'Test 1'
      },
      {
        id: 2,
        name: 'Test 2'
      }
    ]);
  });

  it('does not mutate the source `Array`', () => {
    const subject = [1, 1, 2, 2, 3, 3];

    uniq(subject);

    expect(subject).to.deep.equal([1, 1, 2, 2, 3, 3]);
  });
});
