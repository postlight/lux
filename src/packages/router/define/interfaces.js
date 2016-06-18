// @flow
import type Router from '../index';
import type { options as routeOptions } from '../../route/interfaces';

export type options = routeOptions & { router: Router };
