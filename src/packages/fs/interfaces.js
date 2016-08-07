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
