// @flow
import type { Router$Namespace } from '../index';

export type Namespace$opts = {
  name: Router$Namespace.name;
  path: Router$Namespace.path;
  namespace?: Router$Namespace.namespace;
  controller: Router$Namespace.controller;
  controllers: Router$Namespace.controllers;
};
