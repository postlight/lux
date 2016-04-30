export default function formatSelect(model, attrs = [], prefix = '') {
  const { tableName } = model;

  return attrs.map(attr => {
    return `${tableName}.${model.getColumnName(attr)} AS ${prefix + attr}`;
  });
}
