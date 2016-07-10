// @flow
declare module 'fb-watchman' {
  declare class Client {
    on(event: string, listener: Function): Client;

    end(): void;

    command(
      args: Array<Object|string>,
      callback: (err: ?Error, resp: {
        clock: Object,
        watch: Object,
        relative_path: ?string
      }) => void
    ): void;

    capabilityCheck(
      options: {},
      callback: (err: ?Error, resp: {}) => void
    ): void;
  }
}
