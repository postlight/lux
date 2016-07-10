// @flow
import type { IncomingMessage, ServerResponse } from 'http';

export type Logger$RequestLogger = (
  req: IncomingMessage,
  res: ServerResponse
) => void;
