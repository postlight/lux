const { assign } = Object;

class Base {
  static mixins = [];

  environment = process.env.NODE_ENV || 'development';

  constructor(props = {}) {
    for (let mixin of this.constructor.mixins) {
      mixin.call(this);
    }

    this.setProps(props);

    return this;
  }

  setProps(props = {}) {
    assign(this, props);
    return props;
  }

  static create(props) {
    return new this(props);
  }
}

export default Base;
