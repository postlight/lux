import { expect } from 'chai';

import bound from '../../../src/decorators/bound';

describe('Unit: decorator bound', () => {
  class Subject {
    constructor(name) {
      this.name = name;
    }

    @bound
    sayHello() {
      return `Hello my name is ${this.name}.`;
    }

    @bound
    static sayHello() {
      return `Hello my name is ${this.name}.`;
    }
  }

  it('binds `this` contexts to it\'s target for static methods', () => {
    const { sayHello } = Subject;
    const result = sayHello();

    expect(result).to.equal('Hello my name is Subject.');
  });

  it('binds `this` contexts to it\'s target for instance methods', () => {
    const { sayHello } = new Subject('Test');
    const result = sayHello();

    expect(result).to.equal('Hello my name is Test.');
  });
});
