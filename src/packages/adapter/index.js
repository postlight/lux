// @flow
import type Application from '../application';
import type { Request } from '../request';
import type { Response } from '../response';

export type Adapter = (...args: Array<any>) => Promise<[Request, Response]>;
export type AdapterFactory = (application: Application) => Adapter;

export { default as http } from './http';
export { default as mock } from './mock';
export { default as lambda } from './lambda';
