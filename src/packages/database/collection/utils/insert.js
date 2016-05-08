export default function insert(collection, records) {
  for (let i = 0; i < collection.length; i++) {
    collection[i] = records[i];
  }
}
