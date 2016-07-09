// @flow
import type { IncomingMessage } from 'http';

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

    fields = fields[this.modelName];
    req.params.fields = fields ? fields : this.attributes;
  }
}
