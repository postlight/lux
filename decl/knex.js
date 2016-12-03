// @flow
declare type Knex$QueryBuilderFn = (qb: Knex$QueryBuilder) => Knex$QueryBuilder;

declare class Knex$QueryBuilder mixins Promise {
  select(key?: string[]): this;
  select(...key: string[]): this;
  timeout(ms: number, options?: { cancel: bool }): this;
  column(key: string[]): this;
  column(...key: string[]): this;
  with(alias: string, w: string|Knex$QueryBuilderFn): this;
  withSchema(schema: string): this;
  returning(column: string): this;
  returning(...columns: string[]): this;
  returning(columns: string[]): this;
  as(name: string): this;
  transacting(trx: ?Knex$Transaction): this;
  where(builder: Knex$QueryBuilderFn): this;
  where(column: string, value: any): this;
  where(column: string, operator: string, value: any): this;
  whereNot(builder: Knex$QueryBuilderFn): this;
  whereNot(column: string, value: any): this;
  whereNot(column: string, operator: string, value: any): this;
  whereIn(column: string, values: any[]): this;
  whereNotIn(column: string, values: any[]): this;
  whereNull(column: string): this;
  whereNotNull(column: string): this;
  whereExists(column: string): this;
  whereNotExists(column: string): this;
  whereBetween(column: string, range: number[]): this;
  whereNotBetween(column: string, range: number[]): this;
  whereRaw(raw: any): this;
  orWhere(builder: Knex$QueryBuilderFn): this;
  orWhere(column: string, value: any): this;
  orWhere(column: string, operator: string, value: any): this;
  orWhereNot(builder: Knex$QueryBuilderFn): this;
  orWhereNot(column: string, value: any): this;
  orWhereNot(column: string, operator: string, value: any): this;
  orWhereIn(column: string, values: any[]): this;
  orWhereNotIn(column: string, values: any[]): this;
  orWhereNull(column: string): this;
  orWhereNotNull(column: string): this;
  orWhereExists(column: string): this;
  orWhereNotExists(column: string): this;
  orWhereBetween(column: string, range: number[]): this;
  orWhereNotBetween(column: string, range: number[]): this;
  orWhereRaw(raw: any): this;
  innerJoin(table: string, c1: string, operator: string, c2: string): this;
  innerJoin(table: string, c1: string, c2: string): this;
  innerJoin(builder: Knex$QueryBuilder, c1?: string, c2?: string): this;
  leftJoin(table: string, c1: string, operator: string, c2: string): this;
  leftJoin(table: string, c1: string, c2: string): this;
  leftJoin(builder: Knex$QueryBuilder): this;
  leftOuterJoin(table: string, c1: string, operator: string, c2: string): this;
  leftOuterJoin(table: string, c1: string, c2: string): this;
  rightJoin(table: string, c1: string, operator: string, c2: string): this;
  rightJoin(table: string, c1: string, c2: string): this;
  rightOuterJoin(table: string, c1: string, operator: string, c2: string): this;
  rightOuterJoin(table: string, c1: string, c2: string): this;
  outerJoin(table: string, c1: string, operator: string, c2: string): this;
  outerJoin(table: string, c1: string, c2: string): this;
  fullOuterJoin(table: string, c1: string, operator: string, c2: string): this;
  fullOuterJoin(table: string, c1: string, c2: string): this;
  crossJoin(column: string, c1: string, c2: string): this;
  crossJoin(column: string, c1: string, operator: string, c2: string): this;
  joinRaw(sql: string, bindings?: mixed[]): this;
  distinct(): this;
  groupBy(column: string): this;
  groupByRaw(): this;
  orderBy(column: string, direction?: 'desc' | 'asc'): this;
  orderByRaw(): this;
  offset(offset: number): this;
  limit(limit: number): this;
  having(column: string, operator: string, value: mixed): this;
  union(): this;
  unionAll(): this;
  count(column?: string): this;
  countDistinct(column?: string): this;
  min(column?: string): this;
  max(column?: string): this;
  sum(column?: string): this;
  sumDistinct(column?: string): this;
  avg(column?: string): this;
  avgDistinct(column?: string): this;
  pluck(column: string): this;
  first(): this;
  from(table: string): this;
  from(builder: Knex$QueryBuilderFn|Knex$Knex|Knex$QueryBuilder): this;

  insert(): this;
  del(): this;
  delete(): this;
  update(): this;
  returning(columns: string[]): this;
  columnInfo(column?: string): this;
}

declare class Knex$TableBuilder$Chainable {
  index(): this;
  primary(): this;
  unique(): this;
  references(): this;
  inTable(): this;
  onDelete(): this;
  onUpdate(): this;
  defaultTo(): this;
  unsigned(): this;
  notNullable(): this;
  nullable(): this;
  first(): this;
  after(): this;
  comment(): this;
  collate(): this;
}

declare class Knex$TableBuilder {
  dropColumn(): Knex$TableBuilder$Chainable;
  dropColumns(): Knex$TableBuilder$Chainable;
  renameColumn(): Knex$TableBuilder$Chainable;
  increments(): Knex$TableBuilder$Chainable;
  integer(): Knex$TableBuilder$Chainable;
  bigInteger(): Knex$TableBuilder$Chainable;
  text(): Knex$TableBuilder$Chainable;
  string(): Knex$TableBuilder$Chainable;
  float(): Knex$TableBuilder$Chainable;
  decimal(): Knex$TableBuilder$Chainable;
  boolean(): Knex$TableBuilder$Chainable;
  date(): Knex$TableBuilder$Chainable;
  dateTime(): Knex$TableBuilder$Chainable;
  time(): Knex$TableBuilder$Chainable;
  timestamp(): Knex$TableBuilder$Chainable;
  timestamps(): Knex$TableBuilder$Chainable;
  dropTimestamps(): Knex$TableBuilder$Chainable;
  binary(): Knex$TableBuilder$Chainable;
  enu(): Knex$TableBuilder$Chainable;
  enum(): Knex$TableBuilder$Chainable;
  json(): Knex$TableBuilder$Chainable;
  jsonb(): Knex$TableBuilder$Chainable;
  uuid(): Knex$TableBuilder$Chainable;
  comment(): Knex$TableBuilder$Chainable;
  engine(): Knex$TableBuilder$Chainable;
  charset(): Knex$TableBuilder$Chainable;
  collate(): Knex$TableBuilder$Chainable;
  inherits(): Knex$TableBuilder$Chainable;
  specificType(): Knex$TableBuilder$Chainable;
  index(): Knex$TableBuilder$Chainable;
  dropIndex(): Knex$TableBuilder$Chainable;
  unique(): Knex$TableBuilder$Chainable;
  foreign(): Knex$TableBuilder$Chainable;
  dropForeign(): Knex$TableBuilder$Chainable;
  dropUnique(): Knex$TableBuilder$Chainable;
  dropPrimary(): Knex$TableBuilder$Chainable;
}

type Knex$TableBuilderFn = (table: Knex$TableBuilder) => void;

declare class Knex$SchemaBuilder mixins Promise {
  withSchema(schemaName: string): this;
  createTable(tableName: string, fn: Knex$TableBuilderFn): this;
  createTableIfNotExists(
    tableName: string,
    fn: Knex$TableBuilderFn
  ): Knex$SchemaBuilder;
  renameTable(from: string, to: string): this;
  dropTable(tableName: string): this;
  hasColumn(tableName: string, columnName: string): this;
  hasTable(tableName: string): this;
  dropTableIfExists(tableName: string): this;
  table(tableName: string, fn: Knex$TableBuilderFn): this;
  raw(statement: string): this;
}

declare class Knex$Knex mixins Knex$QueryBuilder, Promise {
  schema: Knex$SchemaBuilder;

  static (config: Knex$Config): Knex$Knex;
  static QueryBuilder: typeof Knex$QueryBuilder;
  (tableName: string): Knex$QueryBuilder;
  raw(sqlString: string): any;
  client: any;
  destroy(): Promise<void>;
  transaction(
    fn: (trx: Knex$Transaction) => void | Knex$Transaction
  ): Knex$Transaction;
}

declare type Knex$PostgresConfig = {
  client?: 'pg',
  connection?: {
    host?: string,
    user?: string,
    password?: string,
    database?: string,
    charset?: string,
  },
  searchPath?: string,
}
declare type Knex$MysqlConfig = {
  client?: 'mysql',
  connection?: {
    host?: string,
    user?: string,
    password?: string,
    database?: string,
  },
}
declare type Knex$SqliteConfig = {
  client?: 'sqlite3',
  connection?: {
    filename?: string,
  }
}
declare type Knex$Config = Knex$PostgresConfig | Knex$MysqlConfig | Knex$SqliteConfig;

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
  }
  declare var exports: typeof Knex$Knex;
}
