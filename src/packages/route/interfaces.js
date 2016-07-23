// @flow
import type Controller from '../controller';
import type { Request, Response, Request$method } from '../server';

export type Route$opts = {
  path: string;
  action: string;
  method: Request$method;
  controllers: Map<string, Controller>;
};

export type Route$handler = (req: Request, res: Response) => any;
