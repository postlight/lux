// @flow
import type Request from '../../../request';
import type Response from '../../../response';

export type Action<T> = (request: Request, response: Response) => Promise<T>;
