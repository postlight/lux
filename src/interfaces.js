// @flow
export interface Lux$Collection<T> {
  size: number;

  has(key: T): boolean;
  clear(): void;
  delete(key: T): boolean;
  values(): Iterator<T>;
}
