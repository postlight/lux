const { assign } = Object;

class Base {
  root = process.env.PWD;

  environment = process.env.NODE_ENV || 'development';

  constructor(props = {}) {
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
