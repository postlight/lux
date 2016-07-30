// @flow
export type Validation$Validator = (value: mixed) => boolean;

export type Validation$opts<T: Validation$Validator> = {
  key: string,
  value: mixed,
  validator: T
};
