// @flow
// src: github.com/flowtype/flow-typed/tree/master/definitions/npm/mocha_v2.4.x
type $npm$mocha$testFunction = (done: () => void) => void | Promise<mixed>;

declare module 'mocha' {
  declare var describe: {
    (name: string, spec: () => void): void;
    only(description: string, spec: () => void): void;
    skip(description: string, spec: () => void): void;
    timeout(ms: number): void;
  };

  declare var context: typeof describe;

  declare var it: {
    (name: string, spec?: $npm$mocha$testFunction): void;
    only(description: string, spec: $npm$mocha$testFunction): void;
    skip(description: string, spec: $npm$mocha$testFunction): void;
    timeout(ms: number): void;
  };

  declare function before(method: $npm$mocha$testFunction): void;
  declare function beforeEach(method: $npm$mocha$testFunction): void;
  declare function after(method: $npm$mocha$testFunction): void;
  declare function afterEach(method: $npm$mocha$testFunction): void;
}
