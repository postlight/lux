// @flow
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * @private
 */
export default function setPage(
  req: IncomingMessage,
  res: ServerResponse
): void {
  const { route } = req;

  if (route && route.action === 'index') {
    const { defaultPerPage } = this;

    let {
      params: {
        page: {
          size,
          number
        } = {
          size: defaultPerPage,
          number: 1
        }
      }
    } = req;

    size = parseInt(size, 10);
    number = parseInt(number, 10);

    if (!Number.isFinite(size)) {
      size = defaultPerPage;
    } else if (!Number.isFinite(number)) {
      number = 1;
    }

    req.params = {
      ...req.params,

      page: {
        size,
        number
      }
    };
  }
}
