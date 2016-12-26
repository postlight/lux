// @flow

/**
 * @private
 */
export type Migration$Fn<T: Object> = (schema: T) => T;
