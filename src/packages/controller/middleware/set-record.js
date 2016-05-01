import tryCatch from '../../../utils/try-catch';
import formatInclude from '../utils/format-include';

export default async function setRecord(req, res) {
  await tryCatch(async () => {
    const { model, relationships } = this;

    let {
      params: {
        id: pk,
        include = [],
        fields: {
          [model.modelName]: select,
          ...includedFields
        }
      }
    } = req;

    if (pk) {
      if (!select) {
        select = this.attributes;
      }

      include = formatInclude(model, include, includedFields, relationships);

      req.record = await model.find(pk, {
        select,
        include
      });
    }
  });
}
