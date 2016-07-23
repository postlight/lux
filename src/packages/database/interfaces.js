// @flow
type Database$columnType =
  | 'floating'
  | 'enu'
  | 'bool'
  | 'varchar'
  | 'bigInteger';

export type Database$column = {
  type: Database$columnType;
  nullable: boolean;
  maxLength: string;
  columnName: string;
  defaultValue: ?mixed;
};
