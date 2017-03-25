/* @flow */

import uniq from '../uniq';

describe('util uniq()', () => {
  test('it works with an array', () => {
    expect(uniq([1, 1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
  });

  test('it works with an array of objects', () => {
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

  test('it does not mutate the source array', () => {
    const subject = [1, 1, 2, 2, 3, 3];

    uniq(subject);

    expect(subject).toEqual([1, 1, 2, 2, 3, 3]);
  });
});
