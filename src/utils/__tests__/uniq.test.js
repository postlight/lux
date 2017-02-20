// @flow
import uniq from '../uniq';

describe('util uniq()', () => {
  it('removes duplicate items from an `Array`', () => {
    expect(uniq([1, 1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
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

    expect(uniq(subject, 'id')).toEqual([
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

    expect(subject).toEqual([1, 1, 2, 2, 3, 3]);
  });
});
