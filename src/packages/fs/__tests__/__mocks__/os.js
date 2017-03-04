/* @flow */

let PLATFORM = 'linux';

export const __setPlatform__ = (value: string) => {
  PLATFORM = value;
};

export const platform = () => PLATFORM;
