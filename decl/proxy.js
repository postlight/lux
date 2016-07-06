declare class Proxy<T> {
  constructor(target: T, handler: {
    get?: (target: T, key: string, reciever: Proxy<T>) => ?mixed | void;
    set?: (target: T, key: string, value: mixed, receiver: Proxy<T>) => void;
    has?: (target: T, key: string) => boolean;
  }): T;
}
