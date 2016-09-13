// @flow

declare module 'sinon' {
  declare type Spy = {
    calledWith: (...args: Array<any>) => boolean;
    calledOnce: boolean;
    restore: () => void;
    reset: () => void;
  };
  declare function spy(module: Object, method: string): Spy;
}
