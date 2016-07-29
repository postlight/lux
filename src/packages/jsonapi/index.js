// @flow
export * from './constants';
export * from './errors';
export { default as isJSONAPI } from './utils/is-jsonapi';
export { default as hasMediaType } from './utils/has-media-type';

export type {
  JSONAPI$versions,
  JSONAPI$Document,
  JSONAPI$ErrorObject,
  JSONAPI$DocumentLinks,
  JSONAPI$ResourceObject,
  JSONAPI$IdentifierObject,
  JSONAPI$RelationshipObject
} from './interfaces';
