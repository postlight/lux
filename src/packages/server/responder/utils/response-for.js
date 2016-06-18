// @flow
import { STATUS_CODES } from '../constants.js';

export default function responseFor(
  status: number,
  err?: Error
): void | Object {
  if (status >= 400 && status < 600) {
    const title = STATUS_CODES.get(status);
    let errData = { title, status };

    if (err) {
      const {
        message,
        stack
      } = err;

      errData = {
        ...errData,
        message,
        stack
      };
    }

    return {
      data: {
        errors: [errData]
      }
    };
  }
}
