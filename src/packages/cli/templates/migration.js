export default (table, attrs = []) => {
  return `
export function up(schema) {

}

export function down(schema) {

}
  `.substr(1).trim();
};
