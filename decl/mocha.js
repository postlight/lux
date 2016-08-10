// @flow
declare module 'mocha' {
  declare function it(description: string, callback: () => void): void;
  declare function describe(description: string, callback: () => void): void;
}
