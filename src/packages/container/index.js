import Base from '../base';

const registryKey = Symbol('registry');

class Container extends Base {
  constructor() {
    return super({
      [registryKey]: new Map()
    });
  }

  lookup(type, name) {
    const registry = this[registryKey];

    return registry.get(`${type}:${name}`);
  }

  register(type, name, factory) {
    const registry = this[registryKey];

    factory.container = this;
    registry.set(`${type}:${name}`, factory);
  }
}

export default Container;
