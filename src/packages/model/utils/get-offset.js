const { max } = Math;

export default function getOffset(page = 1, limit = 25) {
  return max(parseInt(page, 10) - 1 , 0) * limit;
}
