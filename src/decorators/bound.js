export default function bound(target, key, desc) {
  return {
    get() {
      return (...args) => desc.value.apply(this, args);
    }
  };
}
