import { underscore, dasherize } from 'inflection';

import sanitizeParams from '../utils/sanitize-params';

const { isArray } = Array;

export default function action(target, key, desc) {
  const { value } = desc;

  return {
    get() {
      return () => {
        const controller = this;

        const handlers = [
          async function (req, res) {
            if (this.sanitizeParams && key !== 'preflight') {
              const permit = this.params.map(param => {
                return dasherize(underscore(param));
              });

              req.params = sanitizeParams(req.params, permit);
            }
          },

          async function (req, res) {
            try {
              if (key !== 'preflight') {
                const { id } = req.params;

                if (id) {
                  req.record = await this.store.findRecord(this.modelName, id);
                }
              }
            } catch (err) {
              if (err.literalCode === 'NOT_FOUND') {
                req.record = null;
              }
            }
          },

          ...this.middleware,

          async function (req, res) {
            let data = await value.call(this, req, res);

            if (key !== 'preflight') {
              if (data && typeof data !== 'object') {
                return data;
              }

              let { include } = req.params;

              if (include && !isArray(include)) {
                include = [include];
              }

              if (data) {
                data = this.serializer.stream({ data }, include);
              }
            }

            return data;
          }
        ];

        return function* () {
          let i = 0;

          while (i < handlers.length) {
            yield (req, res) => handlers[i].call(controller, req, res);
            i++;
          }
        };
      };
    }
  };
}
