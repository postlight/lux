// @flow
import type Controller from '../controller';
import type { Request, Response } from '../server';

export type options = {
  path: string;
  action: string;
  method: string;
  controllers: Map<string, Controller>;
};

export type Route$handler = (
  req: Request,
  res: Response
) => any;
