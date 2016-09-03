// @flow
import type { Model } from './index';

export const NEW_RECORDS: WeakSet<Model> = new WeakSet();
export const UNIQUE_CONSTRAINT = /UNIQUE\sCONSTRAINT/ig;

export const VALID_DRIVERS = [
  'pg',
  'sqlite3',
  'mssql',
  'mysql',
  'mysql2',
  'mariasql',
  'strong-oracle',
  'oracle'
];

export const TYPE_ALIASES = new Map([
  ['enu', 'array'],
  ['enum', 'array'],

  ['json', 'object'],
  ['jsonb', 'object'],

  ['binary', 'buffer'],

  ['bool', 'boolean'],
  ['boolean', 'boolean'],

  ['time', 'date'],
  ['date', 'date'],
  ['datetime', 'date'],

  ['text', 'string'],
  ['uuid', 'string'],
  ['string', 'string'],
  ['varchar', 'string'],

  ['int', 'number'],
  ['float', 'number'],
  ['integer', 'number'],
  ['decimal', 'number'],
  ['floating', 'number'],
  ['bigInteger', 'number']
]);
