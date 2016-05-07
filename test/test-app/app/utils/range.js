export default function* range(start = 1, end = 1) {
  do {
    yield start++;
  } while (start <= end);
}
