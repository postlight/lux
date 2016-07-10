// @flow

/**
 * @private
 */
export default function* range(start: number, end: number): Iterable<number> {
  while (start <= end) {
    yield start++;
  }
}
