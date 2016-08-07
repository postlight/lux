// @flow
declare module 'chalk' {
  // Styles
  declare function reset(source: string): string;
  declare function bold(source: string): string;
  declare function dim(source: string): string;
  declare function italic(source: string): string;
  declare function underline(source: string): string;
  declare function inverse(source: string): string;
  declare function hidden(source: string): string;
  declare function strikethrough(source: string): string;
  declare function black(source: string): string;
  declare function red(source: string): string;
  declare function green(source: string): string;
  declare function yellow(source: string): string;
  declare function blue(source: string): string;
  declare function magenta(source: string): string;
  declare function cyan(source: string): string;
  declare function white(source: string): string;
  declare function gray(source: string): string;
  declare function grey(source: string): string;
  declare function bgBlack(source: string): string;
  declare function bgRed(source: string): string;
  declare function bgGreen(source: string): string;
  declare function bgYellow(source: string): string;
  declare function bgBlue(source: string): string;
  declare function bgMagenta(source: string): string;
  declare function bgCyan(source: string): string;
  declare function bgWhit(source: string): string;

  // Utils
  declare function hasColor(source: string): boolean;
  declare function stripColor(source: string): string;
}
