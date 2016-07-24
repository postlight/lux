// @flow
import type { Request, Response } from '../../server';

export type Action<T> = (req: Request, res: Response) => Promise<T>;
