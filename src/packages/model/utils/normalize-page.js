const { min, max } = Math;

export default function normalizePage(num = 1) {
  return max(parseInt(num, 10) - 1 , 0);
}
