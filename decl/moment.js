// @flow
declare module 'moment' {
  declare class Moment {
    format(format: string): string;
    parse(source: string): Moment;
  }

  declare function moment(source: Date | number | string | void): Moment;
  declare var exports: moment;
}
