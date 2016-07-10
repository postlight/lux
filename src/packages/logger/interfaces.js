// @flow
export type Logger$level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type Logger$format = 'text' | 'json';
export type Logger$logFn = (data: Logger$data | string) => void;

export type Logger$data = {
  level: Logger$level;
  message: string;
  timestamp: string;
};

export type Logger$config = {
  level: Logger$level;
  format: Logger$format;
  enabled: boolean;
  filter: {
    params: Array<string>;
  };
};
