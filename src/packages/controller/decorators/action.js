export default function action(target, key, desc) {
  const { value } = desc;

  return {
    get() {
      return () => {
        const self = this;

        const handlers = [
          ...this.middleware,

          async (req, res) => {
            if (req.params.id) {
              req.record = await self.model.findById(req.params.id, {
                include: self.include,
                attributes: self.serializedAttributes
              });
            }
          },

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
