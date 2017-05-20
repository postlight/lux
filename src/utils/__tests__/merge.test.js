/* @flow */

import merge from '../merge'

describe('util merge()', () => {
  test('recursively merges two objects together', () => {
    const x = {
      a: 1,
      b: 2,
      c: {
        i: 'a',
        ii: 'b',
        iii: 'c',
        iv: [1, 2, 3]
      }
    }

    const y = {
      a: 1,
      b: '2',
      c: {
        i: 1,
        ii: 'b',
        iii: 3
      }
    }

    expect(merge(x, y)).toEqual({
      a: 1,
      b: '2',
      c: {
        i: 1,
        ii: 'b',
        iii: 3,
        iv: [1, 2, 3]
      }
    })
  })

  test('does not mutate the source objects', () => {
    const x = {
      a: 1,
      b: 2,
      c: {
        i: 'a',
        ii: 'b',
        iii: 'c',
        iv: [1, 2, 3]
      }
    }

    const y = {
      a: 1,
      b: '2',
      c: {
        i: 1,
        ii: 'b',
        iii: 3
      }
    }

    merge(x, y)

    expect(x).toEqual({
      a: 1,
      b: 2,
      c: {
        i: 'a',
        ii: 'b',
        iii: 'c',
        iv: [1, 2, 3]
      }
    })

    expect(y).toEqual({
      a: 1,
      b: '2',
      c: {
        i: 1,
        ii: 'b',
        iii: 3
      }
    })
  })
})
