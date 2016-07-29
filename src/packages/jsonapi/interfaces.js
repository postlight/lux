// @flow
type JSONAPI$value =
  | ?string
  | ?number
  | ?boolean
  | ?JSONAPI$BaseObject
  | Array<JSONAPI$BaseObject>;

interface JSONAPI$BaseObject {
  [key: void | string]: JSONAPI$value;
  meta?: JSONAPI$BaseObject;
}

interface JSONAPI$LinkObject {
  href: string;
  meta?: JSONAPI$BaseObject;
}

type JSONAPI$Link = ?(string | JSONAPI$LinkObject);

interface JSONAPI$ResourceLinksObject {
  self?: JSONAPI$Link;
  related?: JSONAPI$Link;
}

export type JSONAPI$versions = '1.0';

export interface JSONAPI$IdentifierObject {
  id: string;
  type: string;
  meta?: JSONAPI$BaseObject;
}

export interface JSONAPI$ResourceObject {
  id: string;
  type: string;
  links?: JSONAPI$ResourceLinksObject;
  attributes?: JSONAPI$BaseObject;

  relationships?: {
    [key: string]: void | ?JSONAPI$RelationshipObject;
  };
}

export interface JSONAPI$RelationshipObject {
  data: JSONAPI$IdentifierObject;
  meta?: JSONAPI$BaseObject;
  links?: JSONAPI$ResourceLinksObject;
}

export interface JSONAPI$DocumentLinks extends JSONAPI$ResourceLinksObject {
  first?: JSONAPI$Link;
  last?: JSONAPI$Link;
  prev?: ?JSONAPI$Link;
  next?: ?JSONAPI$Link;
}

export interface JSONAPI$ErrorObject {
  id?: string;
  code?: string;
  meta?: JSONAPI$BaseObject;
  title?: string;
  status?: string;
  detail?: string;

  links?: {
    about: JSONAPI$Link;
  };

  source?: {
    pointer?: string;
    parameter?: string;
  };
}

export interface JSONAPI$Document {
  data?: JSONAPI$ResourceObject | Array<JSONAPI$ResourceObject>;
  links?: JSONAPI$DocumentLinks;
  errors?: Array<JSONAPI$ErrorObject>;
  included?: Array<JSONAPI$ResourceObject>;

  jsonapi?: {
    version: JSONAPI$versions;
    meta?: JSONAPI$BaseObject;
  }
}
