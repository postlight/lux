// @flow
declare module 'inflection' {
  declare function indexOf<T: Object>(
    arr: Array<T>,
    item: T,
    fromIndex?: number,
    compareFunc?: Function
  ): string;

  declare function pluralize(source: string, plural?: string): string;
  declare function singularize(source: string, singular?: string): string;
  declare function inflect(source: string): string;
  declare function camelize(source: string, lowerFirst?: boolean): string;
  declare function underscore(source: string, allUpperCase?: boolean): string;
  declare function humanize(source: string,  lowerFirst?: boolean): string;
  declare function capitalize(source: string): string;
  declare function dasherize(source: string): string;
  declare function titleize(source: string): string;
  declare function demodulize(source: string): string;
  declare function tableize(source: string): string;
  declare function classify(source: string): string;
  declare function foreign_key(source: string, lowerFirst?: boolean): string;
  declare function ordinalize(source: string): string;
  declare function transform(source: string, transforms: Array<string>): string;
}
