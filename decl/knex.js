/* @flow */

declare class Knex$SchemaBuilder extends Knex$QueryBuilder {
  raw(query: string): this;
  hasTable(name: string): this;
  dropTable(name: string): this;
  createTable(name: string, fn: (table: Object) => void): this;
}

declare class Lux$Knex extends Knex$Knex {
  schema: Knex$SchemaBuilder;
  transaction((trx: Knex$Transaction) => any): Knex$QueryBuilder;
  batchInsert(table: string, rows: Array<Object>): this;
}

declare module 'knex' {
  declare type Error = {
    name: string,
    length: number,
    severity: string,
    code: string,
    detail: string,
    hint?: string,
    position?: any,
    intenralPosition?: any,
    internalQuery?: any,
    where?: any,
    schema: string,
    table: string,
    column?: any,
    dataType?: any,
    constraint?: string,
    file: string,
    line: string,
    routine: string,
  };
  declare var exports: typeof Lux$Knex;
}
