// @flow
export type Logger$level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type Logger$logFn = (data: string | Object) => void;
export type Logger$format = 'text' | 'json';

export type Logger$data = {
  level: Logger$level;
  message?: mixed;
  timestamp: string;
};

export type Logger$filter = {
  params: Array<string>;
};

export type Logger$config = {
  level: Logger$level;
  format: Logger$format;
  filter: Logger$filter;
  enabled: boolean;
};
