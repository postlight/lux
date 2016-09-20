// @flow

/**
 * @private
 */
export default function* range(
  start: number,
  end: number
): Generator<number, void, void> {
  while (start <= end) {
    yield start++;
  }
}
