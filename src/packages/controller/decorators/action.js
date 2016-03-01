import { underscore, dasherize } from 'inflection';

import sanitizeParams from '../utils/sanitize-params';

export default function action(target, key, desc) {
  const { value } = desc;

  return {
    get() {
      return () => {
        const self = this;

        const handlers = [
          async (req, res) => {
            if (self.sanitizeParams) {
              const permit = self.params.map(param => {
                return dasherize(underscore(param));
              });

              req.params = sanitizeParams(req.params, permit);
            }
          },

          async (req, res) => {
            const { id } = req.params;

            if (id) {
              req.record = await self.model.findRecord(id, {
                include: self.include,
                attributes: self.serializedAttributes
              });
            }
          },

          ...this.middleware,

          async (req, res) => {
            const data = await value.call(self, req, res);

            if (data) {
              return self.serializer.serialize({
                data
              });
            }
          }
        ];

        return function* () {
          let i = 0;

          while (i < handlers.length) {
            yield handlers[i];
            i++;
          }
        };
      };
    }
  };
}
