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
              req.params = sanitizeParams(req.params, self.params);
            }
          },

          async (req, res) => {
            const { id } = req.params;

            if (id) {
              req.record = await self.model.findById(id, {
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
