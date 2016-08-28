// @flow
export type Generator$opts = {
  cwd: string;
  type: string;
  name: string;
  attrs: Array<string>;
  onConflict(text: string): Promise<string | boolean>;
};

export type Generator = (opts: Generator$opts) => Promise<void>;
export type Generator$template = (name: string, attrs: Array<string>) => string;
