// @flow
declare module 'inflection' {
  declare function camelize(source: string, lower: boolean): string;
  declare function classify(source: string): string;
  declare function dasherize(source: string): string;
  declare function pluralize(source: string): string;
  declare function singularize(source: string): string;
  declare function underscore(source: string, upper: boolean): string;
}
