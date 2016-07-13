// @flow
import type { IncomingMessage } from 'http';
import { pluralize } from 'inflection';

/**
 * @private
 */
export default function setFields(req: IncomingMessage): void {
  const { route } = req;

  if (route && /^(index|show)$/g.test(route.action)) {
    let {
      params: {
        fields
      }
    } = req;

    fields = fields[pluralize(this.modelName)];
    req.params.fields = fields ? fields : this.attributes;
  }
}
