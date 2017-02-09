// @flow
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

export type ObjectMap<K, V> = {
  [key: K]: V;
};

export interface Thenable<+R> {
  constructor(callback: (
    resolve: (result: Promise<R> | R) => void,
    reject:  (error: any) => void
  ) => mixed): void;

  then<U>(
    onFulfill?: (value: R) => Promise<U> | U,
    onReject?: (error: any) => Promise<U> | U
  ): Promise<U>;

  catch<U>(
    onReject?: (error: any) => ?Promise<U> | U
  ): Promise<U>;
}
