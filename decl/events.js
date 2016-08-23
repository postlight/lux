// @flow

/**
 * NOTE: This is a temporary fix until the following facebook/flow PR is merged
 *       https://github.com/facebook/flow/pull/2201
 */
declare module 'events' {
  declare class EventEmitter extends events$EventEmitter {
    static EventEmitter: typeof EventEmitter;
  }

  declare var exports: typeof EventEmitter;
}
