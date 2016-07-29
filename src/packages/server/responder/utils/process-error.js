import { NODE_ENV } from '../../../../constants';

/**
 * @private
 */
export default function processError(
  err?: Error
): Object {
  if (NODE_ENV != 'development') {
    Reflect.deleteProperty(err, 'stack');
  }
  if (err instanceof SyntaxError) {
    err.number = 400;
  }
  return err;
}
