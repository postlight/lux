/* @flow */

import {
  transformKeys,
  camelizeKeys,
  dasherizeKeys,
  underscoreKeys
} from '../transform-keys'

describe('util camelizeKeys()', () => {
  const subjectA = {
    key_a: 1,
    key_b: 2,
    key_c: 3,
    key_d: {
      key_a: 1,
    },
  }

  const subjectB = {
    'key-a': 1,
    'key-b': 2,
    'key-c': 3,
    'key-d': {
      'key-a': 1,
    },
  }

  test('can shallow camelize an objects keys', () => {
    expect(camelizeKeys(subjectA)).toMatchSnapshot()
    expect(camelizeKeys(subjectB)).toMatchSnapshot()
  })

  test('can deep camelize an objects keys', () => {
    expect(camelizeKeys(subjectA, true)).toMatchSnapshot()
    expect(camelizeKeys(subjectB, true)).toMatchSnapshot()
  })
})

describe('util dasherizeKeys()', () => {
  const subjectA = {
    key_a: 1,
    key_b: 2,
    key_c: 3,
    key_d: {
      key_a: 1,
    },
  }

  const subjectB = {
    keyA: 1,
    keyB: 2,
    keyC: 3,
    keyD: {
      keyA: 1,
    },
  }

  test('can shallow dasherize an objects keys', () => {
    expect(dasherizeKeys(subjectA)).toMatchSnapshot()
    expect(dasherizeKeys(subjectB)).toMatchSnapshot()
  })

  test('can deep dasherize an objects keys', () => {
    expect(dasherizeKeys(subjectA, true)).toMatchSnapshot()
    expect(dasherizeKeys(subjectB, true)).toMatchSnapshot()
  })
})

describe('util underscoreKeys()', () => {
  const subjectA = {
    keyA: 1,
    keyB: 2,
    keyC: 3,
    keyD: {
      keyA: 1,
    },
  }

  const subjectB = {
    'key-a': 1,
    'key-b': 2,
    'key-c': 3,
    'key-d': {
      'key-a': 1,
    },
  }

  test('can shallow underscore an objects keys', () => {
    expect(underscoreKeys(subjectA)).toMatchSnapshot()
    expect(underscoreKeys(subjectB)).toMatchSnapshot()
  })

  test('can deep underscore an objects keys', () => {
    expect(underscoreKeys(subjectA, true)).toMatchSnapshot()
    expect(underscoreKeys(subjectB, true)).toMatchSnapshot()
  })
})

describe('util transformKeys()', () => {
  const subject = {
    keyA: 1,
    keyB: 2,
    keyC: 3,
    keyD: {
      keyA: 1,
    },
  }

  test('can shallow transform an objects keys', () => {
    const result = transformKeys(subject, key => `${key}Transformed`)

    expect(result).toMatchSnapshot()
  })

  test('can deep transform an objects keys', () => {
    const result = transformKeys(subject, key => `${key}Transformed`, true)

    expect(result).toMatchSnapshot()
  })

  test('does not mutate the source object', () => {
    expect(subject).toMatchSnapshot()
  })

  test('throws when something other than an object is passed in', () => {
    // $FlowIgnore
    expect(() => transformKeys('', key => key, true)).toThrow()
  })

  test('does not fail when an array is used as a source object', () => {
    const source = [1, 2, 3]

    expect(transformKeys(source, key => key, true)).toEqual(source)
  })
})
