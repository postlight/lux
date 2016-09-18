// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import merge from '../merge';

describe('util merge()', () => {
  it('recursively merges two objects together', () => {
    const x = {
      a: 1,
      b: 2,
      c: {
        i: 'a',
        ii: 'b',
        iii: 'c',
        iv: [1, 2, 3]
      }
    };

    const y = {
      a: 1,
      b: '2',
      c: {
        i: 1,
        ii: 'b',
        iii: 3
      }
    };

    expect(merge(x, y)).to.deep.equal({
      a: 1,
      b: '2',
      c: {
        i: 1,
        ii: 'b',
        iii: 3,
        iv: [1, 2, 3]
      }
    });
  });

  it('does not mutate the source objects', () => {
    const x = {
      a: 1,
      b: 2,
      c: {
        i: 'a',
        ii: 'b',
        iii: 'c',
        iv: [1, 2, 3]
      }
    };

    const y = {
      a: 1,
      b: '2',
      c: {
        i: 1,
        ii: 'b',
        iii: 3
      }
    };

    merge(x, y);

    expect(x).to.deep.equal({
      a: 1,
      b: 2,
      c: {
        i: 'a',
        ii: 'b',
        iii: 'c',
        iv: [1, 2, 3]
      }
    });

    expect(y).to.deep.equal({
      a: 1,
      b: '2',
      c: {
        i: 1,
        ii: 'b',
        iii: 3
      }
    });
  });
});
