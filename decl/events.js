// @flow
declare module 'events' {
  declare class EventEmitter {
    static listenerCount(emitter: EventEmitter, event: string): number;

    addListener(event: string, listener: Function): EventEmitter;
    emit(event: string, ...args:Array<any>): boolean;
    listeners(event: string): Array<Function>;
    listenerCount(event: string): number;
    on(event: string, listener: Function): EventEmitter;
    once(event: string, listener: Function): EventEmitter;
    removeAllListeners(event?: string): EventEmitter;
    removeListener(event: string, listener: Function): EventEmitter;
    setMaxListeners(n: number): void;
  }
}
