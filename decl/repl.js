/* @flow */

declare module 'repl' {
  declare type REPL_MODE_MAGIC = Symbol;
  declare type REPL_MODE_SLOPPY = Symbol;
  declare type REPL_MODE_STRICT = Symbol;

  declare class REPLServer extends readline$Interface {
    context: Object;

    displayPrompt(preserveCursor?: boolean): void;
    defineCommand(command: string, options: {
      help?: string;
      action: (...args: Array<any>) => void
    }): void;
  }

  declare function start(options: {
    eval?: Function;
    input?: stream$Readable;
    output?: stream$Writable;
    prompt?: string;
    writer?: Function;
    replMode?: Symbol;
    terminal?: boolean;
    completer?: Function;
    useColors?: boolean;
    useGlobal?: boolean;
    ignoreUndefined?: boolean;
    breakEvalOnSigint?: boolean;
  }): REPLServer;
}
