// @flow

/**
 * @private
 */
export type Migration$Fn<T: Knex$SchemaBuilder> = (schema: T) => T;
