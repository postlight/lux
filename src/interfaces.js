// @flow
export type ObjectMap<T> = {
  [key: string]: T;
};

export interface Lux$Collection<T> {
  size: number;

  has(key: T): boolean;
  clear(): void;
  delete(key: T): boolean;
  values(): Iterator<T>;
}

export interface Chain<T> {
  pipe<U>(handler: (value: T) => U): Chain<U>;
  value(): T;
  construct<U, V: Class<U>>(constructor: V): Chain<U>;
}
