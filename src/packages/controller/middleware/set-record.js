import tryCatch from '../../../utils/try-catch';
import formatInclude from '../utils/format-include';

export default async function setRecord(req, res) {
  await tryCatch(async () => {
    const { model, relationships } = this;

    let {
      method,
      params: {
        id,
        include = [],
        fields: {
          [model.modelName]: select,
          ...includedFields
        }
      }
    } = req;

    if (id) {
      if (method === 'GET') {
        if (!select) {
          select = this.attributes;
        }
      }

      include = formatInclude(model, include, includedFields, relationships);

      req.record = await model.find(id, {
        select,
        include
      });
    }
  });
}
