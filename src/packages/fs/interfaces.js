// @flow
export type fs$writeOpts = string | {
  mode?: number;
  flag?: string;
  encoding?: ?string;
};

export type fs$readOpts = string | {
  flag?: string;
  encoding?: ?string;
};

export type fs$PathRemover = (source: string) => string;

export interface fs$ParsedPath {
  root: string;
  dir: string;
  base: string;
  ext: string;
  name: string;
  relative: string;
  absolute: string;
}
