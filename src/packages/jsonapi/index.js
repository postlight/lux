/* @flow */

import type { ObjectMap } from '../../interfaces'

/* eslint-disable no-use-before-define */

type Value =
  | string
  | number
  | boolean
  | BaseObject
  | Array<BaseObject>;

type BaseObject = ObjectMap<?Value> & {
  meta?: BaseObject;
};

/* eslint-enable no-use-before-define */

export type Link = {
  href: string;
  meta?: BaseObject;
};

export type Links = {
  self?: ?(string | Link);
  related?: ?(string | Link);
};

export type Version =
  | '1.0';

export type Identifier = {
  id: string;
  type: string;
  meta?: BaseObject;
};

export type Relationship = {
  data: Identifier;
  meta?: BaseObject;
  links?: Links;
};

export type Resource = {
  id: string;
  type: string;
  links?: Links;
  attributes?: BaseObject;
  relationships?: ObjectMap<?Relationship>;
};

export type ErrorData = {
  id?: string;
  code?: string;
  meta?: BaseObject;
  title?: string;
  status?: string;
  detail?: string;
  links?: {
    about: Link;
  };
  source?: {
    pointer?: string;
    parameter?: string;
  };
};

export type Document = {
  data?: Resource | Array<Resource>;
  links?: Links & {
    first?: ?(string | Link);
    last?: ?(string | Link);
    prev?: ?(string | Link);
    next?: ?(string | Link);
  };
  errors?: Array<ErrorData>;
  included?: Array<Resource>;
  jsonapi?: {
    version: Version;
    meta?: BaseObject;
  };
};

export * from './constants'
export * from './errors'
export { default as isJSONAPI } from './utils/is-jsonapi'
export { default as hasMediaType } from './utils/has-media-type'
