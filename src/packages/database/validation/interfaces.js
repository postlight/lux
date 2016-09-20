// @flow
export type Validation$opts<T> = {
  key: string;
  value: T;
  validator: (value?: T) => boolean;
};
