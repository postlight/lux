/* @flow */

const BOOLEAN_TYPE = /^(?:boolean|tinyint)$/

export default function createNormalizer(type: string): (value: any) => any {
  let normalizer = value => value

  if (BOOLEAN_TYPE.test(type)) {
    normalizer = value => {
      let normalized = value

      if (typeof value === 'string') {
        normalized = Number.parseInt(value, 10)
      }

      return Boolean(normalized)
    }
  } else if (type === 'datetime') {
    normalizer = value => {
      let normalized = value

      if (typeof value === 'number') {
        normalized = new Date(normalized)
      }

      return normalized
    }
  }

  return normalizer
}
