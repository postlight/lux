// @flow
import {
  isJSONAPI,
  hasMediaType,
  InvalidContentTypeError,
  UnsupportedMediaTypeError
} from '../../jsonapi';

export default function validateContentType(contentType?: string): true {
  if (!contentType || !isJSONAPI(contentType)) {
    throw new InvalidContentTypeError(contentType);
  } else if (hasMediaType(contentType)) {
    throw new UnsupportedMediaTypeError(contentType);
  }

  return true;
}
