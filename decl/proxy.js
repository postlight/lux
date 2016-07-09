// @flow
type Proxy$traps<T> = {
  getPrototypeOf?: (target: T) => ?Object;
  setPrototypeOf?: (target: T, prototype: ?Object) => boolean;
  isExtensible?: (target: T) => boolean;
  preventExtensions?: (target: T) => boolean;
  getOwnPropertyDescriptor?: (target: T, property: string) => void | Object;
  defineProperty?: (target: T, property: string, descriptor: Object) => boolean;
  has?: (target: T, key: string) => boolean;
  get?: (target: T, property: string, reciever: Proxy<T>) => any;
  set?: (target: T, property: string, value: any, receiver: Proxy<T>) => boolean;
  deleteProperty?: (target: T, property: string) => boolean;
  ownKeys?: (target: T) => Array<string>;
  apply?: (target: T, context: any, args: Array<any>) => any;
  construct?: (target: T, args: Array<any>, newTarget: Function) => Object;
};

type Proxy$revocable<T> = T & {
  revoke(): void;
};

declare class Proxy<T> {
  constructor(target: T, handler: Proxy$traps<T>): T;

  static revocable(target: T, handler: Proxy$traps<T>): Proxy$revocable<T>;
}
